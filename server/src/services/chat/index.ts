import ApiError from '../../exceptions/error/index'

import DialogModel from '../../models/dialog/index'
import MessageModel from '../../models/message/index'

import ChatDialogDto from '../../dtos/dialog/index'
import MessageDialogDto from '../../dtos/message/index'

import { validateForm } from '../../lib/validate/index'

export default new class ChatService {
  async findDialog ({ dialogId, companionId, userId }) {
    try {
      if (dialogId) {
        const dialog = await DialogModel.findById(dialogId)

        return new ChatDialogDto(dialog)
      }

      const createdDialog = await DialogModel.create({ userId, companionId })

      return new ChatDialogDto(createdDialog)
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при получении диалога')
    }
  }
  
  async createMessage ({ userId, companionId, dialogId, text, isIncomingMessage = false }) {
    try {
      const errors = validateForm({ companionId, dialogId, text })

      if (errors) {
        throw ApiError.BadRequest('Некорректный запрос', errors)
      }

      const dialog = await this.findDialog({ userId, companionId, dialogId })

      const message = await MessageModel.create({
        dialogId: dialog.id,
        createdAt: Date.now(),
        text,
        isIncomingMessage
      })

      return new MessageDialogDto(message)
    } catch ({ message, errors }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при создании сообщения', errors)
    }
  }

  async getMessages (dialogId, limit = 5) {
    try {
      if (!dialogId) {
        return await MessageModel
          .find()
          .limit(limit)
      }

      return await MessageModel
        .find({ dialogId })
        .limit(limit)
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при получении списка сообщений')
    }
  }

  async getDialogs (dialogId) {
    try {
      if (dialogId) {
        return await DialogModel.findById(dialogId)
      }
  
      return await DialogModel.find()
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при получении списка диалогов')
    }
  }
}
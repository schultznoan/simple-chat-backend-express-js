import ApiError from '../../exceptions/error/index'

import DialogModel from '../../models/dialog/index'
import MessageModel from '../../models/message/index'

import ChatDialogDto from '../../dtos/dialog/index'
import MessageDialogDto from '../../dtos/message/index'

export default new class ChatService {
  async findDialog ({ dialogId, companionId, userId }) {
    try {
      if (dialogId) {
        const dialog = await DialogModel.findById(dialogId)

        return new ChatDialogDto(dialog)
      }

      const createdDialog = await DialogModel.create({ userId, companionId })

      return new ChatDialogDto(createdDialog)
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при получении диалога')
    }
  }
  
  async createMessage ({ userId, companionId, dialogId, text, isIncomingMessage = false }) {
    try {
    //   if (!dialogId) {
    //     throw ApiError.BadRequest('Некорректный запрос', { dialogId: 'Обязательное поле' })
    //   }

    //   if (!text) {
    //     throw ApiError.BadRequest('Некорректный запрос', { text: 'Текст сообщения не может быть пустым' })
    //   }

      const dialog = await this.findDialog({ userId, companionId, dialogId })

      const message = await MessageModel.create({
        dialogId: dialog.id,
        createdAt: Date.now(),
        text,
        isIncomingMessage
      })

      return new MessageDialogDto(message)
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при создании сообщения')
    }
  }

  async getDialogs (dialogId) {
    try {
      if (dialogId) {
        return await DialogModel.findById(dialogId)
      }
  
      return await DialogModel.find()
    } catch (error) {
      throw ApiError.BadRequest(error?.message || 'Произошла ошибка при получении списка диалогов')
    }
  }
}
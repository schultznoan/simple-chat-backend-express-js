import ApiError from '../../exceptions/error/index'

import DialogModel from '../../models/dialog/index'
import MessageModel from '../../models/message/index'

import ChatDialogDto from '../../dtos/dialog/index'
import MessageDialogDto from '../../dtos/message/index'

import { validateForm } from '../../lib/validate/index'

import {
  FindDialogPayload,
  CreateMessagePayload
} from './interface'

export default new class ChatService {
  async findDialog ({ dialogId, companionId, userId }: FindDialogPayload): Promise<ChatDialogDto> {
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
  
  async createMessage ({ userId, companionId, dialogId, text, isIncomingMessage = false }: CreateMessagePayload): Promise<MessageDialogDto> {
    try {
      const errors: Record<string, string> = validateForm({ companionId, dialogId, text })

      if (errors) {
        throw ApiError.BadRequest('Некорректный запрос', errors)
      }

      const dialog: ChatDialogDto = await this.findDialog({ userId, companionId, dialogId })

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

  async getMessages (dialogId: string, limit: number = 5): Promise<Array<MessageDialogDto>> {
    try {
      const messages = await MessageModel
        .find(dialogId ? { dialogId } : undefined)
        .limit(limit)

      const messagesDtos: Array<MessageDialogDto> = []

      for (let i = 0; i < messages.length; i++) {
        messagesDtos.push(new MessageDialogDto(messages[i]))
      }

      return messagesDtos
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при получении списка сообщений')
    }
  }

  async getDialogs (dialogId: string): Promise<ChatDialogDto> {
    try {
      const dialogs = dialogId ? await DialogModel.findById(dialogId) : await DialogModel.find()
  
      return new ChatDialogDto(dialogs)
    } catch ({ message }) {
      throw ApiError.BadRequest(message || 'Произошла ошибка при получении списка диалогов')
    }
  }
}
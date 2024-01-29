import { Types } from 'mongoose'

export default class ChatDialog {
  id: Types.ObjectId = null
  dialogId: Types.ObjectId = null
  createdAt: number = 0
  text: string = ''
  isIncomingMessage: boolean = false

  constructor (model) {
    this.id = model._id
    this.dialogId = model.dialogId
    this.createdAt = model.createdAt
    this.text = model.text
    this.isIncomingMessage = model?.isIncomingMessage || false
  }
}
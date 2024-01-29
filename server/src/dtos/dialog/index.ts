import { Types } from 'mongoose'

export default class ChatDialog {
  id: Types.ObjectId = null
  userId: Types.ObjectId = null
  companionId: Types.ObjectId = null

  constructor (model) {
    this.id = model._id
    this.userId = model.userId
    this.companionId = model.companionId
  }
}
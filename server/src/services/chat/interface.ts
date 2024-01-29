import { Types } from 'mongoose'

export interface FindDialogPayload {
  dialogId: Types.ObjectId
  companionId: Types.ObjectId
  userId: Types.ObjectId
}

export interface CreateMessagePayload {
  dialogId: Types.ObjectId
  companionId: Types.ObjectId
  userId: Types.ObjectId
  text: string
  isIncomingMessage: boolean
}
import { Schema, model } from 'mongoose'

export default model('Dialog', new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  companionId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  title: {
    type: String,
    require: true
  },
  lastMessageId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Message'
  }
}))
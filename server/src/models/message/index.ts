import { Schema, model } from 'mongoose'

export default model('Message', new Schema({
  dialogId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Dialog'
  },
  createdAt: {
    type: Number,
    required: true
  },
  text: {
    type: String
  },
  isIncomingMessage: {
    type: Boolean,
    default: false
  }
}))
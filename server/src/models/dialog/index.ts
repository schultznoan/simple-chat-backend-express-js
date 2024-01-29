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
  }
}))
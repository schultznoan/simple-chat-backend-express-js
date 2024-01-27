import { Schema, model } from 'mongoose'

export default model('Token', new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  refreshToken: {
    type: String,
    unique: true,
    reqyured: true
  }
}))
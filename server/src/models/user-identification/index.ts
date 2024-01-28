import { Schema, model } from 'mongoose'

export default model('UserIdentification', new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    unique: true,
    reqyured: true
  }
}))
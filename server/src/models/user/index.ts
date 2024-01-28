import { Schema, model } from 'mongoose'

export default model('User', new Schema({
  fio: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
}))
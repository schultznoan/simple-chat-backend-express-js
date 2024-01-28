import { Types } from 'mongoose'
export default class UsernDto {
    id: Types.ObjectId = null
    fio: string = ''
    email: string = ''
  
    constructor (model) {
      this.id = model._id
      this.fio = model.fio
      this.email = model.email
    }
  }
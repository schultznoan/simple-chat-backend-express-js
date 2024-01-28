export default class UserIdentificationDto {
  password: string = null

  constructor (model) {
    this.password = model.password
  }
}
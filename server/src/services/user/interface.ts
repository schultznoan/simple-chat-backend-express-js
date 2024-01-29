import { Types } from 'mongoose'

import { TokensResponse } from './tokens/interface'

export interface UserPayload {
  fio?: string
  email: string
  password: string
}

export interface UserResponse extends TokensResponse {
  id: Types.ObjectId
  fio: string
  email: string
}


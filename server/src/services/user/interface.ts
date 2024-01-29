import { Types } from 'mongoose'

import { TokensResponse } from './tokens/interface'

export interface UserPayload extends TokensResponse {
  fio?: string
  email: string
  password: string
}

export interface UserResponse {
  id: Types.ObjectId
  fio: string
  email: string
}


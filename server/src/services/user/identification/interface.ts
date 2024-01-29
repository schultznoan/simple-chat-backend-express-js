import { Types } from 'mongoose'

export interface SavePasswordPayload {
  id: Types.ObjectId
  email: string
  password: string
}

export interface ComparePasswordPayload {
  userId: Types.ObjectId
  currentPassword: string
}
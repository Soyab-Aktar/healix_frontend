import { UserStatus } from "./doctor.types"

export interface IAdmin {
  id: string
  name: string
  email: string
  profilePhoto?: string | null
  contactNumber?: string | null
  isDeleted: boolean
  createdAt: string | Date
  updatedAt: string | Date
  userId: string
  user?: {
    status: UserStatus
  } | null
}

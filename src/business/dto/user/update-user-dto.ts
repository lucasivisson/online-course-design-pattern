import { UserEntity } from "@/entities/user-entity"

export interface InputUpdateUserDto {
  id: string
  name: string
  email: string
}

export type OutputUpdateUserDto = UserEntity
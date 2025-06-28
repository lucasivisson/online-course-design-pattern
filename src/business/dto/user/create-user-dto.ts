import { UserEntity } from "@/entities/user-entity"

export interface InputCreateUserDto {
  name: string
  email: string
}

export type OutputCreateUserDto = UserEntity
import { UserEntity } from "@/entities/user-entity"

export interface InputGetUserDto {
  id: string
}

export type OutputGetUserDto = UserEntity
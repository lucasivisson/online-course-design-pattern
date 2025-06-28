import { UserEntity } from "@/entities/user-entity"

export interface IUserRepository {
  create(input: { user: UserEntity }): Promise<UserEntity>
  list(): Promise<UserEntity[]>
  getBy(input: { userId: string }): Promise<UserEntity>
  update(input: { user: UserEntity }): Promise<UserEntity>
}
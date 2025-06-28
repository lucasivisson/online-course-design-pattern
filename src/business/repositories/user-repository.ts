import { UserEntity } from "@/entities/user-entity"

export type InputFindBy = Partial<Omit<IUserRepository, 'createdAt' | 'updatedAt'>>

export interface IUserRepository {
  create(input: { user: UserEntity }): Promise<UserEntity>
  list(): Promise<UserEntity[]>
  getBy(input: InputFindBy): Promise<UserEntity>
  update(input: { user: UserEntity }): Promise<UserEntity>
}
import { IUserRepository } from "@/business/repositories/user-repository"
import { UserEntity } from "@/entities/user-entity"

interface CreateUserInput {
  name: string
  email: string
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const user = new UserEntity(input.name, input.email)
    const createdUser = await this.userRepository.create({ user })
    return createdUser
  }
}
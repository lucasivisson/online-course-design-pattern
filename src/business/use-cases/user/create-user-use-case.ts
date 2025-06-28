import { InputCreateUserDto, OutputCreateUserDto } from "@/business/dto/user/create-user-dto"
import { IUserRepository } from "@/business/repositories/user-repository"
import { UserEntity } from "@/entities/user-entity"

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: InputCreateUserDto): Promise<OutputCreateUserDto> {
    const user = new UserEntity(input.name, input.email)
    const createdUser = await this.userRepository.create({ user })
    return createdUser
  }
}
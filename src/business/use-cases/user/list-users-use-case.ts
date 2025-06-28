import { OutputListUsersDto } from '@/business/dto/user/list-users-dto'
import { IUserRepository } from '@/business/repositories/user-repository'

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<OutputListUsersDto> {
    const users = await this.userRepository.list()
    return users
  }
}
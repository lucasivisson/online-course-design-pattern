import { InputGetUserDto, OutputGetUserDto } from '@/business/dto/user/get-user-dto'
import { IUserRepository } from '@/business/repositories/user-repository'

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: InputGetUserDto): Promise<OutputGetUserDto> {
    if (!input.id) {
      throw new Error("Pelo menos 'id' deve ser fornecido para buscar um usuário.")
    }
    const user = await this.userRepository.getBy(input)
    return user
  }
}
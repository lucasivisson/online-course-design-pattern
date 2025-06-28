import { InputUpdateUserDto, OutputUpdateUserDto } from '@/business/dto/user/update-user-dto'
import { IUserRepository } from '@/business/repositories/user-repository'

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: InputUpdateUserDto): Promise<OutputUpdateUserDto> {
    if (!user.id) {
      throw new Error('ID do usuário é obrigatório para atualização.')
    }

    const { id, ...dataToUpdate } = user
    const updatedUser = await this.userRepository.update({ id, dataToUpdate})
    return updatedUser
  }
}
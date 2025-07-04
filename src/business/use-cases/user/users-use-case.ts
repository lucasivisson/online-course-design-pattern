import { OutputListUsersDto } from "@/business/dto/user/list-users-dto";
import { IUserRepository } from "@/business/repositories/user-repository";
import {
  InputCreateUserDto,
  OutputCreateUserDto,
} from "@/business/dto/user/create-user-dto";

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async list(): Promise<OutputListUsersDto> {
    const users = await this.userRepository.list();
    return users;
  }

  async create(data: InputCreateUserDto): Promise<OutputCreateUserDto> {
    return await this.userRepository.create(data);
  }
}

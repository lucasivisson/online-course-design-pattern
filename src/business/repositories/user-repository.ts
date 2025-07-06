import { UserEntity } from "@/entities/user-entity";
import { InputCreateUserDto } from "@/business/dto/user/create-user-dto";

export type InputFindBy = Partial<Omit<UserEntity, "createdAt" | "updatedAt">>;
export type InputGetManyById = { userIds: string[] };
export type InputUpdateFields = {
  id: string;
  dataToUpdate: Partial<Omit<UserEntity, "createdAt" | "updatedAt">>;
};

export interface IUserRepository {
  create(input: InputCreateUserDto): Promise<UserEntity>;
  list(): Promise<UserEntity[]>;
  getBy(input: InputFindBy): Promise<UserEntity | null>;
  getManyById(input: InputGetManyById): Promise<UserEntity[]>
  update(input: InputUpdateFields): Promise<UserEntity>;
}

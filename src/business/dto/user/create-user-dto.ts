import { UserEntity, RoleEnum } from "@/entities/user-entity";

export interface InputCreateUserDto {
  name: string;
  email: string;
  role: RoleEnum;
  password: string;
}

export const InputCreateUserDtoIsValid = (
  data: unknown
): data is InputCreateUserDto => {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "email" in data &&
    "role" in data &&
    "password" in data
  );
};

export type OutputCreateUserDto = UserEntity;

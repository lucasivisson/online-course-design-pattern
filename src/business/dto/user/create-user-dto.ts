import { UserEntity } from "@/entities/user-entity";
import { IsEmail, IsString, Length, IsIn } from "class-validator";

export class InputCreateUserDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsIn(["professor", "student"])
  role: string;

  @IsString()
  @Length(6, 32)
  password: string;
}

export type OutputCreateUserDto = UserEntity;

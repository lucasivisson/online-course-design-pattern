import { User, Role } from "@prisma/client";

export type RoleEnum = Role;

export class UserEntity implements User {
  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.password = data.password;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  role: Role;
  password: string;
}

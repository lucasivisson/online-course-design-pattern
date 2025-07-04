import { Role } from "@prisma/client";

export interface UserEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  role: Role;
  password: string;
}

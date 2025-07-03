import { prisma } from "@/framework/database/prisma";
import { UserEntity } from "@/entities/user-entity";
import {
  InputFindBy,
  InputUpdateFields,
  IUserRepository,
} from "@/business/repositories/user-repository";
import { Prisma, User } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  async create(input: { user: UserEntity }): Promise<UserEntity> {
    const user = input.user;

    await prisma.user.create({
      data: user,
    });

    return user;
  }

  async list(): Promise<UserEntity[]> {
    const users: User[] = await prisma.user.findMany();

    return users;
  }

  async getBy(input: InputFindBy): Promise<UserEntity> {
    const user = await prisma.user.findUniqueOrThrow({
      where: input as Prisma.UserWhereUniqueInput,
    });

    return user;
  }

  async update(input: InputUpdateFields): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: { id: input.id },
      data: input.dataToUpdate,
    });

    return user;
  }
}

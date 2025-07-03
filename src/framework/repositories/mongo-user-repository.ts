import { prisma } from "@/framework/database/prisma";
import {
  InputFindBy,
  InputUpdateFields,
  IUserRepository,
} from "@/business/repositories/user-repository";
import { Prisma, User } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async list(): Promise<User[]> {
    const users: User[] = await prisma.user.findMany();

    return users;
  }

  async getBy(input: InputFindBy): Promise<User> {
    const user = await prisma.user.findUniqueOrThrow({
      where: input as Prisma.UserWhereUniqueInput,
    });

    return user;
  }

  async update(input: InputUpdateFields): Promise<User> {
    const user = await prisma.user.update({
      where: { id: input.id },
      data: input.dataToUpdate,
    });

    return user;
  }
}

import { prisma } from "@/framework/database/prisma";
import {
  InputFindBy,
  InputGetManyById,
  InputUpdateFields,
  IUserRepository,
} from "@/business/repositories/user-repository";
import { Prisma, User } from "@prisma/client";
import { isValidObjectId } from "@/shared/isObjectId";
import { UserEntity } from "@/entities/user-entity";

export class PrismaUserRepository implements IUserRepository {
  async create(data: User): Promise<UserEntity> {
    return await prisma.user.create({
      data,
    });
  }

  async list(): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users;
  }

  async getBy(input: InputFindBy): Promise<User | null> {
    console.log(input.id);
    if (!isValidObjectId(input?.id)) return null;

    const user = await prisma.user.findUniqueOrThrow({
      where: input as Prisma.UserWhereUniqueInput,
    });

    return user;
  }

  async getManyById(input: InputGetManyById): Promise<UserEntity[]> {
    const user = await prisma.user.findMany({
      where: { id: { in: input.userIds } },
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

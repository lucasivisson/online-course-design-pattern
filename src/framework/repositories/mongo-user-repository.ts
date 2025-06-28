import { prisma } from "@/framework/database/prisma"
import { UserEntity } from "@/entities/user-entity"
import { IUserRepository } from "@/business/repositories/user-repository"
import { User } from "../database/prisma/config"

export class PrismaUserRepository implements IUserRepository {
  async create(input: { user: UserEntity }): Promise<UserEntity> {
    const user = input.user

    await prisma.user.create({
      data: user,
    })

    return user
  }

  async list(): Promise<UserEntity[]> {
    const users: User[] = await prisma.user.findMany()

    return users.map(user =>
      new UserEntity(
        user.name,
        user.email,
        user.id,
        user.createdAt,
        user.updatedAt
      )
    )
  }

  async getBy(input: { userId: string }): Promise<UserEntity> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: input.userId },
    })

    return new UserEntity(
      user.name,
      user.email,
      user.id,
      user.createdAt,
      user.updatedAt
    )
  }

  async update(input: { user: UserEntity }): Promise<UserEntity> {
    const user = input.user

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        updatedAt: new Date(),
      },
    })

    return user
  }
}
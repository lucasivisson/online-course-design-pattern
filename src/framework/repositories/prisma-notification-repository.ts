import { prisma } from "@/framework/database/prisma"
import { INotificationRepository, InputCreateNotification, InputFindByReceiverId, InputUpdateFields } from "@/business/repositories/notification-repository"
import { NotificationEntity } from "@/entities/notification-entity"
import { Prisma } from "@prisma/client"

export class PrismaNotificationRepository implements INotificationRepository {
  async create(input: InputCreateNotification): Promise<NotificationEntity> {
    const post = await prisma.notification.create({
      data: input,
    })

    return post
  }

  async findManyByReceiverId(input: InputFindByReceiverId): Promise<NotificationEntity[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        receiversIds: {
          has: input.userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications;
  }

  async findBy(input: InputUpdateFields): Promise<NotificationEntity> {
    const notification = await prisma.notification.findUniqueOrThrow({
      where: input as Prisma.NotificationWhereUniqueInput,
    });

    return notification;
  }

  async update(input: InputUpdateFields): Promise<NotificationEntity> {
    const notification = await prisma.notification.update({
      where: { id: input.id },
      data: input.dataToUpdate,
    });

    return notification;
  }
}
import { prisma } from "@/framework/database/prisma"
import { INotificationRepository, InputCreateNotification, InputFindByReceiverId } from "@/business/repositories/notification-repository"
import { NotificationEntity } from "@/entities/notification-entity"

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
}
import { NotificationEntity } from "@/entities/notification-entity";

export type InputCreateNotification = {
  message: string
  senderId: string
  receiversIds: string[]
}

export type InputFindByReceiverId = {
  userId: string
}

export interface INotificationRepository {
  create(input: InputCreateNotification): Promise<NotificationEntity>
  findManyByReceiverId(input: InputFindByReceiverId): Promise<NotificationEntity[]>
}
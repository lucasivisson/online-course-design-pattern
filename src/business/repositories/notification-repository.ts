import { NotificationEntity } from "@/entities/notification-entity";

export type InputCreateNotification = {
  message: string
  senderId: string
  receiversIds: string[]
}

export type InputFindByReceiverId = {
  userId: string
}

export type InputUpdateFields = {
  id: string;
  dataToUpdate: Partial<Omit<NotificationEntity, "createdAt" | "updatedAt">>;
};

export type InputFindNotificationBy = Partial<Omit<NotificationEntity, "createdAt" | "updatedAt">>;

export interface INotificationRepository {
  create(input: InputCreateNotification): Promise<NotificationEntity>
  findManyByReceiverId(input: InputFindByReceiverId): Promise<NotificationEntity[]>
  update(input: InputUpdateFields): Promise<NotificationEntity>
  findBy(input: InputFindNotificationBy): Promise<NotificationEntity>
}
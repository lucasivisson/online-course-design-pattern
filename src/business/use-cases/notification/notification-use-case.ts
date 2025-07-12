import { InputListNotificationsDto, InputReadNotificationDto, OutputListNotificationsDto, OutputReadNotificationDto } from "@/business/dto/notification/notification-dto";
import { NotificationNotFound } from "@/business/errors/notifications";
import { INotificationRepository } from "@/business/repositories/notification-repository";

export class NotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async list(input: InputListNotificationsDto): Promise<OutputListNotificationsDto> {
    return await this.notificationRepository.findManyByReceiverId({ userId: input.userId })
  }

  async read(input: InputReadNotificationDto): Promise<OutputReadNotificationDto> {
    const notification = await this.notificationRepository.findBy({ id: input.notificationId })
    if(!notification) {
      throw new Error(JSON.stringify(NotificationNotFound))
    }
    const newReadBy = [...notification.readBy, input.userId]
    await this.notificationRepository.update({
      id: input.notificationId,
      dataToUpdate: {
        readBy: newReadBy
      }
    })
  }
}
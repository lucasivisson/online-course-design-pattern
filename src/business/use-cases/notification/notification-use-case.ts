import { InputListNotificationsDto, OutputListNotificationsDto } from "@/business/dto/notification/notification-dto";
import { INotificationRepository } from "@/business/repositories/notification-repository";

export class NotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async list(input: InputListNotificationsDto): Promise<OutputListNotificationsDto> {
    return await this.notificationRepository.findManyByReceiverId({ userId: input.userId })
  }
}
import { NotificationEntity } from "@/entities/notification-entity"
import { IsNotEmpty, IsString } from "class-validator"

export class InputListNotificationsDto {
  @IsString()
  @IsNotEmpty()
  userId: string
}

export type OutputListNotificationsDto = NotificationEntity[]
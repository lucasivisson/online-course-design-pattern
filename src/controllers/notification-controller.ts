import { InputListNotificationsDto, InputReadNotificationDto } from "@/business/dto/notification/notification-dto";
import { NotificationUseCase } from "@/business/use-cases/notification/notification-use-case";
import { PrismaNotificationRepository } from "@/framework/repositories/prisma-notification-repository";
import { errorHandler } from "@/shared/http-handler";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class NotificationController {
  private notificationUseCase: NotificationUseCase;

  constructor() {
    this.notificationUseCase = new NotificationUseCase(
      new PrismaNotificationRepository()
    );
  }

  async list(userId: string) {
    try {
      const dto = plainToInstance(InputListNotificationsDto, { userId });
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const notifications = await this.notificationUseCase.list(dto);

      return new Response(JSON.stringify(notifications), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao listar notificacoes:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }

  async read(userId: string, notificationId: string) {
    try {
      const dto = plainToInstance(InputReadNotificationDto, { userId, notificationId });
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const notifications = await this.notificationUseCase.read(dto);

      return new Response(JSON.stringify(notifications), {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch(error) {
      console.error("Erro ao marcar notificacao como lida", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }
}

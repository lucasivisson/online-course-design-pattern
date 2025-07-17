import { api } from "@/config/api";
import { NotificationEntity } from "@/entities/notification-entity";

export type InputCreateNotification = { notificationId: string }

export class NotificationService {
  static async markAsRead(input: InputCreateNotification): Promise<unknown> {
    try {
      const a = await api.patch(`/api/notifications/${input.notificationId}`, {});
      console.log('a', a)
      return {}
    } catch (error) {
      console.error("Error update notification:", error);
      throw new Error("Failed to update notification");
    }
  }

  static async index(): Promise<NotificationEntity[]> {
    try {
      const response = await api.get<NotificationEntity[]>(`/api/notifications`);
      console.log('response', response)
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  }
}

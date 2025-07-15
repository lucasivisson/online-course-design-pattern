import { api } from "@/config/api";
import { NotificationEntity } from "@/entities/notification-entity";

export type InputCreatePost = { notificationId: string }

export class PostService {
  static async markAsRead(input: InputCreatePost): Promise<unknown> {
    try {
      await api.patch(`/api/notifications/${input.notificationId}`, {});
      return {}
    } catch (error) {
      console.error("Error update notification:", error);
      throw new Error("Failed to update notification");
    }
  }

  static async index(): Promise<NotificationEntity[]> {
    try {
      const response = await api.get<{ notifications: NotificationEntity[] }>(`/api/notifications`);
      return response.notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  }
}

import { useCallback, useEffect, useState } from "react";
import { NotificationService } from "@/services/notification-service";
import { NotificationEntity } from "@/entities/notification-entity";

interface UseNotificationsResult {
  notifications: NotificationEntity[];
  loading: boolean;
  error: string | null;
  markNotificationAsRead: (
    notificationId: string,
    userId: string
  ) => Promise<void>;
  updateNotification: (updated: NotificationEntity) => void;
  refetchNotifications: () => void;
  countNotReadedNotifications: (
    notifications: NotificationEntity[],
    userId: string
  ) => number;
}

export const useNotifications = (): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await NotificationService.index();
      setNotifications(result);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const countNotReadedNotifications = (
    notifications: NotificationEntity[],
    userId: string
  ): number => {
    console.log("countNotReadedNotifications.notifications", notifications);
    console.log("countNotReadedNotifications.userId", userId);
    const notificationsQtt = notifications.filter(
      (notification) => !notification.readBy.includes(userId)
    ).length;
    console.log("notificationsQtt", notificationsQtt);
    return notificationsQtt;
  };

  const markNotificationAsRead = async (
    notificationId: string,
    userId: string
  ) => {
    try {
      await NotificationService.markAsRead({ notificationId });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, readBy: [...n.readBy, userId] } : n
        )
      );
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
    }
  };

  const updateNotification = (updated: NotificationEntity) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
  };

  const refetchNotifications = () => {
    fetchNotifications();
  };

  return {
    notifications,
    loading,
    error,
    updateNotification,
    markNotificationAsRead,
    refetchNotifications,
    countNotReadedNotifications,
  };
};

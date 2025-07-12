import { NotificationController } from "@/controllers/notification-controller";
import { USER_ID } from "@/shared/constants";

const controller = new NotificationController();

export const GET = async () => {
  return controller.list(USER_ID);
};

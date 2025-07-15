import { NotificationController } from "@/controllers/notification-controller";
import { USER_ID } from "@/shared/constants";
import { NextRequest } from "next/server";

const controller = new NotificationController();

export const PATCH = async (
  _req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) => {
  const { notificationId } = await params;
  return controller.read(USER_ID, notificationId);
};

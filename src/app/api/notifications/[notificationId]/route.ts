import { NotificationController } from "@/controllers/notification-controller";
import { NextRequest } from "next/server";

const controller = new NotificationController();

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) => {
  const { notificationId } = await params;
  return controller.read(req, notificationId);
};

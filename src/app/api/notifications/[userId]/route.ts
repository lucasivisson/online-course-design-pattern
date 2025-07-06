import { NotificationController } from "@/controllers/notification-controller";
import { NextRequest } from "next/server";

const controller = new NotificationController();

export const GET = (
  _req: NextRequest,
  { params }: { params: { userId: string; } }) => {
  const { userId } = params;
  return controller.list(userId)
}

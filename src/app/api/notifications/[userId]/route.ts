import { NotificationController } from "@/controllers/notification-controller";
import { NextRequest } from "next/server";

const controller = new NotificationController();

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  const { userId } = await params;
  return controller.list(userId);
};

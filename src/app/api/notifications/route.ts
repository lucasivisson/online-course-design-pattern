import { NotificationController } from "@/controllers/notification-controller";
import { NextRequest } from "next/server";

const controller = new NotificationController();

export const GET = async (req: NextRequest) => {
  return controller.list(req);
};

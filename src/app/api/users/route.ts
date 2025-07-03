import { UserController } from "@/controllers/user-controller";
import { NextRequest } from "next/server";

const controller = new UserController();

export const GET = () => controller.list();
export const POST = (req: NextRequest) => controller.create(req);

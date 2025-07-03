import { UserController } from "@/controllers/user-controller";

const controller = new UserController();

export const GET = () => controller.list();
export const POST = (req: Request) => controller.create(req);

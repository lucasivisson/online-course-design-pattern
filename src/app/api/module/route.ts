import { ModuleController } from "@/controllers/module-controller";
import { NextRequest } from "next/server";

const controller = new ModuleController();

export const GET = () => controller.list();
export const POST = (req: NextRequest) => controller.create(req);

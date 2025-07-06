import { PostController } from "@/controllers/post-controller";
import { NextRequest } from "next/server";

const controller = new PostController();

export const POST = (req: NextRequest) => controller.create(req);

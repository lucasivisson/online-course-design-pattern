import { CourseController } from "@/controllers/course-controller";
import { NextRequest } from "next/server";

const controller = new CourseController();

export const GET = () => controller.list();
export const POST = (req: NextRequest) => controller.create(req);

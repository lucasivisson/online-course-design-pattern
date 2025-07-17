import { NextRequest } from "next/server";
import { CourseController } from "@/controllers/course-controller";

const controller = new CourseController();

export const GET = (req: NextRequest) => controller.listTeacherCourses(req);

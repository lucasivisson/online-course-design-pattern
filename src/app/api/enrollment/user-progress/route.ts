import { EnrollmentController } from "@/controllers/enrollment-controller";
import { NextRequest } from "next/server";

const controller = new EnrollmentController();

export async function GET(request: NextRequest) {
  return await controller.getUserCoursesWithProgress(request);
}

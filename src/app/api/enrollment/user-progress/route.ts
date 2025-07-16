import { USER_ID } from "@/shared/constants";
import { EnrollmentController } from "@/controllers/enrollment-controller";

const controller = new EnrollmentController();

export async function GET() {
  return await controller.getUserCoursesWithProgress(USER_ID);
}

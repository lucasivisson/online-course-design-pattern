import { EnrollmentController } from "@/controllers/enrollment-controller";
import { NextRequest } from "next/server";

const controller = new EnrollmentController();

interface Params {
  params: Promise<{ courseId: string }>;
}
export const POST =
  (req: NextRequest, { params }: Params) =>
  async () => {
    const { courseId } = await params;
    return controller.buyCourse(req, courseId);
  };

import { EnrollmentController } from "@/controllers/enrollment-controller";
import { NextRequest } from "next/server";

const controller = new EnrollmentController();

interface Params {
  params: Promise<{ courseId: string }>;
}

export const POST = async (req: NextRequest, { params }: Params) => {
  const { courseId } = await params;
  return await controller.buyCourse(req, courseId);
};

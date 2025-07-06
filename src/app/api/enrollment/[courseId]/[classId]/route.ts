import { EnrollmentController } from "@/controllers/enrollment-controller";
import { NextRequest } from "next/server";

const controller = new EnrollmentController();

interface Params {
  params: Promise<{ courseId: string; classId: string }>;
}

export const POST = async (req: NextRequest, { params }: Params) => {
  const { courseId, classId } = await params;
  return await controller.completeClass(req, courseId, classId);
};

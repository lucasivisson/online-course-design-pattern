import { CourseController } from "@/controllers/course-controller";
import { NextRequest } from "next/server";

const controller = new CourseController();

type Params = {
  params: Promise<{
    courseId: string;
  }>;
};

export const GET = async (_: NextRequest, { params }: Params) => {
  const { courseId } = await params;
  return controller.get({ courseId });
};
export const DELETE = async (_: NextRequest, { params }: Params) => {
  const { courseId } = await params;
  return controller.delete({ courseId });
};
export const PUT = async (req: NextRequest, { params }: Params) => {
  const { courseId } = await params;
  return controller.update(req, courseId);
};

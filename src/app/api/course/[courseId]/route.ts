import { CourseController } from "@/controllers/course-controller";
import { NextRequest } from "next/server";

const controller = new CourseController();

type Params = {
  params: {
    courseId: string;
  };
};

export const GET = (_: NextRequest, { params }: Params) =>
  controller.get({ courseId: params.courseId });
export const DELETE = (_: NextRequest, { params }: Params) =>
  controller.delete({ courseId: params.courseId });
export const PUT = (req: NextRequest, { params }: Params) =>
  controller.update(req, params.courseId);

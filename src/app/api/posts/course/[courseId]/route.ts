import { PostController } from "@/controllers/post-controller";
import { NextRequest } from "next/server";

const controller = new PostController();

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await params;
  return controller.list(req, courseId);
};

import { PostController } from "@/controllers/post-controller";
import { USER_ID } from "@/shared/constants";
import { NextRequest } from "next/server";

const controller = new PostController();

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await params;
  return controller.list(USER_ID, courseId);
};

import { PostController } from "@/controllers/post-controller";
import { NextRequest } from "next/server";

const controller = new PostController();

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; courseId: string }> }
) => {
  const { userId, courseId } = await params;
  return controller.list(userId, courseId);
};

import { PostController } from "@/controllers/post-controller";
import { NextRequest } from "next/server";

const controller = new PostController();

export const GET = (
  _req: NextRequest,
  { params }: { params: { userId: string; courseId: string } }
) => {
  const { userId, courseId } = params;
  return controller.list(userId, courseId);
};

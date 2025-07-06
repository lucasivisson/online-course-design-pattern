import { PostController } from "@/controllers/post-controller";
import { NextRequest } from "next/server";

const controller = new PostController();

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; postId: string }> }
) => {
  const { userId, postId } = await params;
  return controller.addThreadOnPost(req, userId, postId);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; postId: string }> }
) => {
  const { userId, postId } = await params;
  return controller.delete(userId, postId);
};

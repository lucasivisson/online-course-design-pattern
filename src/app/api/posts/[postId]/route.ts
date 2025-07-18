import { PostController } from "@/controllers/post-controller";
import { NextRequest } from "next/server";

const controller = new PostController();

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) => {
  const { postId } = await params;
  return controller.addThreadOnPost(req, postId);
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) => {
  const { postId } = await params;
  return controller.delete(req, postId);
};

import { PostController } from "@/controllers/post-controller";
import { USER_ID } from "@/shared/constants";
import { NextRequest } from "next/server";

const controller = new PostController();

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) => {
  const { postId } = await params;
  return controller.addThreadOnPost(req, USER_ID, postId);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) => {
  const { postId } = await params;
  return controller.delete(USER_ID, postId);
};

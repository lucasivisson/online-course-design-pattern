import { PostController } from "@/controllers/post-controller";
import { NextRequest } from "next/server";

const controller = new PostController();

export const UPDATE = (
  req: NextRequest,
  { params }: { params: { userId: string; postId: string } }) => {
  const { userId, postId } = params;
  return controller.addThreadOnPost(req, userId, postId)
}

export const DELETE = (
  _req: NextRequest,
  { params }: { params: { userId: string; postId: string } }) => {
  const { userId, postId } = params;
  return controller.delete(userId, postId)
}
import { PrismaPostRepository } from "@/framework/repositories/prisma-post-repository";
import { CreatePostUseCase } from "@/business/use-cases/post/post-use-case";
import { NextApiRequest } from "next";

export async function POST(req: NextApiRequest) {
  try {
    const postRepository = new PrismaPostRepository();
    const createPostUseCase = new CreatePostUseCase(postRepository);

    const { authorId, courseId, message } = req.body

    const post = await createPostUseCase.create({ authorId, courseId, message });

    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erro ao consultar usuários:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

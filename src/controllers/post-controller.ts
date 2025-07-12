import { NextRequest } from "next/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { errorHandler } from "@/shared/http-handler";
import { PostUseCase } from "@/business/use-cases/post/post-use-case";
import { PrismaPostRepository } from "@/framework/repositories/prisma-post-repository";
import {
  InputAddThreadToPostDto,
  InputCreatePostDto,
  InputDeletePostDto,
  InputListPostsDto,
} from "@/business/dto/posts/posts-dto";

export class PostController {
  private postUseCase: PostUseCase;

  constructor() {
    this.postUseCase = new PostUseCase(new PrismaPostRepository());
  }

  async delete(userId: string, postId: string) {
    try {
      const dto = plainToInstance(InputDeletePostDto, { userId, postId });
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const post = await this.postUseCase.delete(dto);

      return new Response(JSON.stringify({ post }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }

  async create(req: NextRequest) {
    try {
      const formData = await req.formData();

      const courseId = formData.get('courseId') as string;
      const authorId = formData.get('authorId') as string;
      const message = formData.get('message') as string;
      const file = formData.get('file') as File | null;

      const input = plainToInstance(InputCreatePostDto, {
        courseId,
        authorId,
        message,
        file: file && {
          fileBuffer: Buffer.from(await file.arrayBuffer()),
          fileName: file.name,
          type: file.type,
        },
      });
      const errors = await validate(input);

      if (errors.length > 0) return errorHandler(errors);

      await this.postUseCase.create(input);

      return new Response(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao criar post:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }

  async addThreadOnPost(req: NextRequest, userId: string, postId: string) {
    try {
      const formData = await req.formData();

      const message = formData.get('message') as string;
      const file = formData.get('file') as File | null;

      const input = plainToInstance(InputAddThreadToPostDto, {
        userId,
        postId,
        thread: {
          message,
          authorId: userId,
          file: file && {
            fileBuffer: Buffer.from(await file.arrayBuffer()),
            fileName: file.name,
            type: file.type,
          },
        },
      });
      const errors = await validate(input);

      if (errors.length > 0) return errorHandler(errors);

      await this.postUseCase.addThreadOnPost(input);

      return new Response(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar thread:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }

  async list(userId: string, courseId: string) {
    try {
      console.log('{ userId, courseId }', { userId, courseId })
      const dto = plainToInstance(InputListPostsDto, { userId, courseId });
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const posts = await this.postUseCase.list(dto);

      return new Response(JSON.stringify(posts), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao listar posts:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }
}

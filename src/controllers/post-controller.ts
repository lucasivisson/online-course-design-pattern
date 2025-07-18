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

  async delete(req: NextRequest, postId: string) {
    try {
      const userId = req.nextUrl.searchParams.get("userId");

      if (!userId) {
        return errorHandler([
          {
            property: "userId",
            constraints: {
              isNotEmpty: "userId é necessário",
            },
          },
        ]);
      }

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
      const userId = req.nextUrl.searchParams.get("userId");

      if (!userId) {
        return errorHandler([
          {
            property: "userId",
            constraints: {
              isNotEmpty: "userId é necessário",
            },
          },
        ]);
      }
      const formData = await req.formData();

      const courseId = formData.get('courseId') as string;
      const message = formData.get('message') as string;
      const file = formData.get('file') as File | null;

      const input = plainToInstance(InputCreatePostDto, {
        courseId,
        authorId: userId,
        message,
        file: file && {
          fileBuffer: Buffer.from(await file.arrayBuffer()),
          fileName: file.name,
          type: file.type,
        },
      });
      console.log('input backend', input)
      const errors = await validate(input);

      if (errors.length > 0) return errorHandler(errors);

      const post = await this.postUseCase.create(input);

      return new Response(JSON.stringify({ post }), {
        status: 201,
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

  async addThreadOnPost(req: NextRequest, postId: string) {
    try {
      const userId = req.nextUrl.searchParams.get("userId");

      if (!userId) {
        return errorHandler([
          {
            property: "userId",
            constraints: {
              isNotEmpty: "userId é necessário",
            },
          },
        ]);
      }
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

      const post = await this.postUseCase.addThreadOnPost(input);

      return new Response(JSON.stringify({ post }), {
        status: 200,
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

  async list(req: NextRequest, courseId: string) {
    try {
      const userId = req.nextUrl.searchParams.get("userId");

      if (!userId) {
        return errorHandler([
          {
            property: "userId",
            constraints: {
              isNotEmpty: "userId é necessário",
            },
          },
        ]);
      }
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

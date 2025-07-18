import "reflect-metadata";
import {
  InputCreateCourseDto,
  InputDeleteCourseDto,
  InputGetCourseDto,
  InputUpdateCourseDto,
} from "@/business/dto/course/course-dto";
import { NextRequest } from "next/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { errorHandler } from "@/shared/http-handler";
import { CourseUseCase } from "@/business/use-cases/course/course-use-case";
import { PrismaCourseRepository } from "@/framework/repositories/prisma-course-repository";
import { PrismaUserRepository } from "@/framework/repositories/mongo-user-repository";
import { handleSuccess } from "@/shared/http-handler";

export class CourseController {
  private courseUseCase: CourseUseCase;

  constructor() {
    this.courseUseCase = new CourseUseCase(
      new PrismaCourseRepository(),
      new PrismaUserRepository()
    );
  }

  async list() {
    try {
      const data = await this.courseUseCase.list();

      return handleSuccess(data);
    } catch (error) {
      console.error("Erro ao consultar curso:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async get(data: InputGetCourseDto) {
    try {
      const dto = plainToInstance(InputGetCourseDto, data);
      const response = await this.courseUseCase.get(dto);
      return new Response(JSON.stringify({ course: response }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao consultar curso:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async create(req: NextRequest) {
    try {
      const data = await req.json();

      const dto = plainToInstance(InputCreateCourseDto, data);

      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const courseCreated = await this.courseUseCase.create(dto);

      return new Response(JSON.stringify({ ...courseCreated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async update(req: NextRequest, courseId: string) {
    try {
      const data = await req.json();

      const dto = plainToInstance(InputUpdateCourseDto, {
        ...data,
        courseId,
      });
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const courseUpdated = await this.courseUseCase.update(dto);

      return new Response(JSON.stringify({ ...courseUpdated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async delete(data: InputDeleteCourseDto) {
    try {
      const dto = plainToInstance(InputDeleteCourseDto, data);
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      await this.courseUseCase.delete(dto);

      return new Response(undefined, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async listTeacherCourses(req: NextRequest) {
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

      const users = await this.courseUseCase.listCoursesFromTeacher(userId);

      return new Response(JSON.stringify({ users }), {
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
}

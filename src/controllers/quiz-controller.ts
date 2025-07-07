import "reflect-metadata";
import {
  InputCreateQuizDto,
  InputDeleteQuizDto,
  InputGetQuizDto,
  InputUpdateQuizDto,
} from "@/business/dto/quiz/quiz-dto";
import { NextRequest } from "next/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { errorHandler } from "@/shared/http-handler";
import { QuizUseCase } from "@/business/use-cases/quiz/quiz-use-case";
import { PrismaQuizRepository } from "@/framework/repositories/prisma-quiz-repository";

export class QuizController {
  private quizUseCase: QuizUseCase;

  constructor() {
    this.quizUseCase = new QuizUseCase(new PrismaQuizRepository());
  }

  async list() {
    try {
      const quiz = await this.quizUseCase.list();

      return new Response(JSON.stringify({ quiz }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao consultar quiz:", error);
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

  async get(data: InputGetQuizDto) {
    try {
      const dto = plainToInstance(InputGetQuizDto, data);
      const quiz = await this.quizUseCase.get(dto);
      return new Response(JSON.stringify({ quiz }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao consultar quiz:", error);
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
      const quiz = await req.json();

      const dto = plainToInstance(InputCreateQuizDto, quiz);
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const quizCreated = await this.quizUseCase.create(dto);

      return new Response(JSON.stringify({ ...quizCreated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
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

  async update(req: NextRequest, quizId: string) {
    try {
      const quiz = await req.json();

      const dto = plainToInstance(InputUpdateQuizDto, { ...quiz, quizId });
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const quizUpdated = await this.quizUseCase.update(dto);

      return new Response(JSON.stringify({ ...quizUpdated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar quiz:", error);
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

  async delete(data: InputDeleteQuizDto) {
    try {
      const dto = plainToInstance(InputDeleteQuizDto, data);
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      await this.quizUseCase.delete(dto);

      return new Response(undefined, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao excluir quiz:", error);
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
}

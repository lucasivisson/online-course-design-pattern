import {
  InputCreateQuizDto,
  InputDeleteQuizDto,
  InputGetQuizDto,
  InputUpdateQuizDto,
} from "@/business/dto/quiz/quiz-dto";
import { prisma } from "@/framework/database/prisma";
import { IQuizRepository } from "@/business/repositories/quiz-repository";
import { QuizEntity } from "@/entities/quiz-entity";
import { isValidObjectId } from "@/shared/isObjectId";
import { InputGetQuizBy } from "@/business/repositories/quiz-repository";
import { Prisma } from "@prisma/client";

export class PrismaQuizRepository implements IQuizRepository {
  async list(): Promise<QuizEntity[]> {
    return await prisma.quiz.findMany();
  }

  async create(input: InputCreateQuizDto): Promise<QuizEntity> {
    const quiz = await prisma.quiz.create({
      data: input,
    });

    return quiz;
  }

  async update(input: InputUpdateQuizDto): Promise<QuizEntity> {
    const quiz = await prisma.quiz.update({
      where: { id: input.quizId },
      data: { name: input.name, questions: input.questions },
    });

    return quiz;
  }

  async get(input: InputGetQuizDto): Promise<QuizEntity | null> {
    if (!isValidObjectId(input.quizId)) return null;

    const quiz = await prisma.quiz.findFirst({
      where: { id: input.quizId },
    });

    return quiz;
  }

  async delete(input: InputDeleteQuizDto): Promise<void> {
    await prisma.quiz.delete({
      where: { id: input.quizId },
    });
  }

  async getBy(input: InputGetQuizBy): Promise<QuizEntity | null> {
    if (input.id && !isValidObjectId(input.id)) {
      return null;
    }

    return await prisma.quiz.findUnique({
      where: input as Prisma.QuizWhereUniqueInput,
    });
  }
}

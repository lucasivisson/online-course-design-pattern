import { PrismaEnrollmentsRepository } from "@/framework/repositories/mongo-enrollment-repository";
import { InputBuyCourseDto } from "@/business/dto/enrollment/enrollment-dto";
import { NextRequest } from "next/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { errorHandler, handleSuccess } from "@/shared/http-handler";
import { USER_ID } from "@/shared/constants";
import { EnrollmentUseCase } from "@/business/use-cases/enrollment/enrollment-use-case";
import { PrismaCourseRepository } from "@/framework/repositories/prisma-course-repository";
import { handleError } from "@/shared/http-handler";

export class EnrollmentController {
  private enrollmentUseCase: EnrollmentUseCase;

  constructor() {
    this.enrollmentUseCase = new EnrollmentUseCase(
      new PrismaEnrollmentsRepository(),
      new PrismaCourseRepository()
    );
  }

  async buyCourse(req: NextRequest, courseId: string) {
    try {
      const userId = USER_ID;
      const data = await req.json();

      const dto = plainToInstance(InputBuyCourseDto, data);
      const errors = await validate(dto);
      console.log("test");

      if (errors.length > 0) return errorHandler(errors);

      const userCreated = await this.enrollmentUseCase.buyCourse(
        courseId,
        userId,
        dto
      );

      return handleSuccess(userCreated);
    } catch (error) {
      console.error("Erro ao comprar curso:", error);
      return handleError(error);
    }
  }

  async completeClass(req: NextRequest, courseId: string, classId: string) {
    try {
      const userId = USER_ID;

      const userCreated = await this.enrollmentUseCase.completeClass(
        courseId,
        userId,
        classId
      );

      return handleSuccess(userCreated);
    } catch (error) {
      console.error("Erro ao completar aula:", error);
      return handleError(error);
    }
  }

  async getUserCoursesWithProgress(userId: string) {
    try {
      const enrollments =
        await this.enrollmentUseCase.getUserCoursesWithProgress(userId);

      return handleSuccess(enrollments);
    } catch (error) {
      console.error("Erro ao comprar curso:", error);
      return handleError(error);
    }
  }
}

import { PrismaEnrollmentsRepository } from "@/framework/repositories/mongo-enrollment-repository";
import { InputBuyCourseDto } from "@/business/dto/enrollment/enrollment-dto";
import { NextRequest } from "next/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { errorHandler } from "@/shared/http.errorHandler";
import { USER_ID } from "@/shared/constants";
import { EnrollmentUseCase } from "@/business/use-cases/enrollment/enrollment-use-case";

export class EnrollmentController {
  private enrollmentUseCase: EnrollmentUseCase;

  constructor() {
    this.enrollmentUseCase = new EnrollmentUseCase(
      new PrismaEnrollmentsRepository()
    );
  }

  async buyCourse(req: NextRequest, courseId: string) {
    try {
      const userId = USER_ID;
      const data = await req.json();

      const dto = plainToInstance(InputBuyCourseDto, data);
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const userCreated = await this.enrollmentUseCase.buyCourse(
        courseId,
        userId,
        dto
      );

      return new Response(JSON.stringify({ ...userCreated }), {
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

import { prisma } from "@/framework/database/prisma";
import {
  IEnrollmentRepository,
  InputGetEnrollmentBy,
} from "@/business/repositories/enrollment-repository";
import { Enrollments } from "@prisma/client";
import { CreateEnrollment } from "@/business/dto/enrollment/enrollment-dto";
import { isValidObjectId } from "@/shared/isObjectId";
import { Prisma } from "@prisma/client";

export class PrismaEnrollmentsRepository implements IEnrollmentRepository {
  async create(data: CreateEnrollment): Promise<Enrollments> {
    return await prisma.enrollments.create({
      data: {
        ...data,
      },
    });
  }

  async getBy(input: InputGetEnrollmentBy): Promise<Enrollments | null> {
    // Validate ObjectId if id is provided
    if (input.id && !isValidObjectId(input.id)) {
      return null;
    }

    return await prisma.enrollments.findFirst({
      where: input as Prisma.EnrollmentsWhereUniqueInput,
    });
  }
}

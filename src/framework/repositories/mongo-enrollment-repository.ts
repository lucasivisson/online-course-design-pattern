import { prisma } from "@/framework/database/prisma";
import {
  IEnrollmentRepository,
  InputGetEnrollmentBy,
} from "@/business/repositories/enrollment-repository";
import { Enrollments } from "@prisma/client";
import { CreateEnrollment } from "@/business/dto/enrollment/enrollment-dto";
import { isValidObjectId } from "@/shared/isObjectId";
import { Prisma } from "@prisma/client";
import { EnrollmentEntity } from "@/entities/enrollment-entity";

export class PrismaEnrollmentsRepository implements IEnrollmentRepository {
  async create(data: CreateEnrollment): Promise<EnrollmentEntity> {
    return await prisma.enrollments.create({
      data: {
        ...data,
      },
      include: {
        course: { include: { professor: true } },
        student: true,
      },
    });
  }

  async getBy(input: InputGetEnrollmentBy): Promise<EnrollmentEntity | null> {
    // Validate ObjectId if id is provided
    if (input.id && !isValidObjectId(input.id)) {
      return null;
    }

    return await prisma.enrollments.findFirst({
      where: input as Prisma.EnrollmentsWhereUniqueInput,
      include: {
        course: { include: { professor: true } },
        student: true,
      },
    });
  }

  async updateBy(
    input: InputGetEnrollmentBy
  ): Promise<EnrollmentEntity | null> {
    const { id, ...updateData } = input;

    return await prisma.enrollments.update({
      where: { id },
      data: updateData,
      include: {
        course: { include: { professor: true } },
        student: true,
      },
    });
  }

  async findManyByUserId(userId: string): Promise<Enrollments[]> {
    return await prisma.enrollments.findMany({
      where: { studentId: userId },
    });
  }

  async listByUserId(userId: string): Promise<EnrollmentEntity[]> {
    return await prisma.enrollments.findMany({
      where: { studentId: userId },
      include: {
        course: { include: { professor: true } },
        student: true,
      },
    });
  }
}

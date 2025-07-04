import { prisma } from "@/framework/database/prisma";
import { IEnrollmentRepository } from "@/business/repositories/enrollment-repository";
import { Enrollments } from "@prisma/client";
import { CreateEnrollment } from "@/business/dto/enrollment/enrollment-dto";

export class PrismaEnrollmentsRepository implements IEnrollmentRepository {
  async create(data: CreateEnrollment): Promise<Enrollments> {
    return await prisma.enrollments.create({
      data: {
        ...data,
      },
    });
  }
}

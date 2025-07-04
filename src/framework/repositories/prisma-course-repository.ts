import { prisma } from "@/framework/database/prisma";

import { ICourseRepository } from "@/business/repositories/course-repository";
import { CourseEntity } from "@/entities/course-entity";
import {
  InputCreateCourseDto,
  InputDeleteCourseDto,
  InputGetCourseDto,
  InputUpdateCourseDto,
} from "@/business/dto/course/course-dto";
import { isValidObjectId } from "@/shared/isObjectId";

export class PrismaCourseRepository implements ICourseRepository {
  async list(): Promise<CourseEntity[]> {
    return await prisma.course.findMany({
      include: {
        professor: true,
        Enrollments: {
          select: {
            id: true,
            finished: true,
            paymentMethod: true,
            finalPrice: true,
            student: true,
            finishedClassesIds: true,
            finishedModulesIds: true,
            updatedAt: true,
            createdAt: true,
            courseId: true,
            studentId: true,
          },
        },
        modules: true,
        posts: true,
      },
    });
  }

  async create(input: InputCreateCourseDto): Promise<CourseEntity> {
    const data = await prisma.course.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        professorId: input.professorId,
      },
    });

    return data;
  }

  async update(input: InputUpdateCourseDto): Promise<CourseEntity> {
    const data = await prisma.course.update({
      where: { id: input.courseId },
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        professorId: input.professorId,
      },
    });

    return data;
  }

  async get(input: InputGetCourseDto): Promise<CourseEntity | null> {
    if (!isValidObjectId(input.courseId)) return null;

    const data = await prisma.course.findFirst({
      where: { id: input.courseId },
      include: {
        professor: true,
        Enrollments: {
          select: {
            id: true,
            finished: true,
            paymentMethod: true,
            finalPrice: true,
            student: true,
            finishedClassesIds: true,
            finishedModulesIds: true,
            updatedAt: true,
            createdAt: true,
            courseId: true,
            studentId: true,
          },
        },
        modules: true,
        posts: true,
      },
    });

    return data;
  }

  async delete(input: InputDeleteCourseDto): Promise<void> {
    await prisma.course.delete({
      where: { id: input.courseId },
    });
  }
}

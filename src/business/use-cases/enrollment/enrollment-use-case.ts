import {
  InputBuyCourseDto,
  OutputBuyCourseDto,
} from "@/business/dto/enrollment/enrollment-dto";
import { IEnrollmentRepository } from "@/business/repositories/enrollment-repository";
import { ICourseRepository } from "@/business/repositories/course-repository";
import { PaymentMethod } from "@/entities/enrollment-entity";
import { notFoundError } from "@/shared/http-handler";
import { validationError } from "@/shared/http-handler";

export class EnrollmentUseCase {
  constructor(
    private enrollmentRepository: IEnrollmentRepository,
    private courseRepository: ICourseRepository
  ) {}

  async buyCourse(
    courseId: string,
    userId: string,
    data: InputBuyCourseDto
  ): Promise<OutputBuyCourseDto> {
    const course = await this.courseRepository.getBy({ id: courseId });

    if (!course) {
      throw notFoundError("Curso não encontrado.");
    }

    const enrollment = await this.enrollmentRepository.getBy({
      studentId: userId,
    });

    if (enrollment) {
      throw notFoundError("Curso já comprado.");
    }

    console.log(
      "enrollment",
      this.calculateFinalPrice(data.paymentMethod, course.price)
    );

    return await this.enrollmentRepository.create({
      paymentMethod: data.paymentMethod,
      courseId,
      finalPrice: this.calculateFinalPrice(data.paymentMethod, course.price),
      finished: false,
      finishedModulesIds: [],
      finishedClassesIds: [],
      studentId: userId,
    });
  }

  calculateFinalPrice(paymentMethod: PaymentMethod, price: number) {
    if (paymentMethod === "pix") {
      return price * 0.95;
    }

    return price;
  }

  async completeClass(courseId: string, userId: string, classId: string) {
    const course = await this.courseRepository.getById(courseId);

    if (!course) {
      throw notFoundError("Curso não encontrado.");
    }

    const enrollment = await this.enrollmentRepository.getBy({
      studentId: userId,
    });

    if (!enrollment) {
      throw notFoundError("Matrícula não encontrada.");
    }

    const foundModuleWithClass = course?.modules?.find((module) =>
      module.classes.some((classItem) => classItem.id === classId)
    );

    if (!foundModuleWithClass) {
      throw notFoundError("Aula não encontrada no curso.");
    }

    if (enrollment.finishedClassesIds.includes(classId)) {
      throw validationError("Aula já completada.");
    }

    const isModuleFinished =
      enrollment.finishedClassesIds.length ===
      foundModuleWithClass.classes.length;

    const isCourseFinished =
      enrollment.finishedModulesIds.length === course.modules?.length;

    return await this.enrollmentRepository.updateBy({
      id: enrollment.id,
      finished: isCourseFinished,
      finishedClassesIds: [...enrollment.finishedClassesIds, classId],
      finishedModulesIds: isModuleFinished
        ? [...enrollment.finishedModulesIds, foundModuleWithClass.id]
        : enrollment.finishedModulesIds,
    });
  }
}

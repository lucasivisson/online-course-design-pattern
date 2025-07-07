import {
  InputBuyCourseDto,
  OutputBuyCourseDto,
} from "@/business/dto/enrollment/enrollment-dto";
import { IEnrollmentRepository } from "@/business/repositories/enrollment-repository";
import { ICourseRepository } from "@/business/repositories/course-repository";
import { notFoundError } from "@/shared/http-handler";
import { validationError } from "@/shared/http-handler";
import { PaymentStrategyFactory } from "@/business/strategies/payment-strategy";
import { ProgressService } from "@/business/chain/progress-handler";

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

    const paymentStrategy = PaymentStrategyFactory.createStrategy(
      data.paymentMethod,
      data.installments
    );

    const finalPrice = paymentStrategy.calculateFinalPrice(course.price);

    return await this.enrollmentRepository.create({
      paymentMethod: data.paymentMethod,
      courseId,
      finalPrice,
      finished: false,
      finishedModulesIds: [],
      finishedClassesIds: [],
      studentId: userId,
    });
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

    const progressService = new ProgressService(course.modules || []);

    if (!progressService.canAccessClass(enrollment, classId)) {
      throw validationError(
        "Você precisa completar as aulas anteriores antes de acessar esta aula."
      );
    }

    if (enrollment.finishedClassesIds.includes(classId)) {
      throw validationError("Aula já completada.");
    }

    const foundModuleWithClass = course?.modules?.find((module) =>
      module.classes.some((classItem) => classItem.id === classId)
    );

    if (!foundModuleWithClass) {
      throw notFoundError("Aula não encontrada no curso.");
    }

    const allClassesInModuleCompleted = foundModuleWithClass.classes.every(
      (classItem) =>
        enrollment.finishedClassesIds.includes(classItem.id) ||
        classItem.id === classId
    );

    const isModuleFinished = allClassesInModuleCompleted;
    const isCourseFinished =
      course.modules?.every(
        (module) =>
          enrollment.finishedModulesIds.includes(module.id) ||
          (module.id === foundModuleWithClass.id && isModuleFinished)
      ) ?? false;

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

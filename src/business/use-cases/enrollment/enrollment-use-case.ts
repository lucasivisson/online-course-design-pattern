import {
  InputBuyCourseDto,
  OutputBuyCourseDto,
} from "@/business/dto/enrollment/enrollment-dto";
import { IEnrollmentRepository } from "@/business/repositories/enrollment-repository";
import { USER_ID } from "@/shared/constants";

export class EnrollmentUseCase {
  constructor(private enrollmentRepository: IEnrollmentRepository) {}

  async buyCourse(
    courseId: string,
    data: InputBuyCourseDto
  ): Promise<OutputBuyCourseDto> {
    // const course = "courseId"; // This should be replaced with actual course fetching logic

    return await this.enrollmentRepository.create({
      paymentMethod: data.paymentMethod,
      courseId,
      finalPrice: 2, //add course information
      finished: false,
      finishedModulesIds: [],
      finishedClassesIds: [],
      studentId: USER_ID,
    });
  }
}

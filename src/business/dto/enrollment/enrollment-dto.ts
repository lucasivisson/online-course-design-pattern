import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { IsString, IsIn } from "class-validator";
import * as Enrollment from "@/entities/enrollment-entity";

export interface CreateEnrollment extends InputBuyCourseDto {
  finished: boolean;
  finishedModulesIds: string[];
  finishedClassesIds: string[];
  paymentMethod: Enrollment.PaymentMethod;
  finalPrice: number;
  courseId: string;
  studentId: string;
}

export class InputBuyCourseDto {
  @IsString()
  @IsIn(Enrollment.PaymentMethods)
  paymentMethod: Enrollment.PaymentMethod;
}

export type OutputBuyCourseDto = EnrollmentEntity;

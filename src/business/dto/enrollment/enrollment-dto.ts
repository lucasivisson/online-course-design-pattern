import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { IsString, IsIn } from "class-validator";
import type { PaymentMethod } from "@/entities/enrollment-entity";
import { PaymentMethods } from "@/entities/enrollment-entity";

export interface CreateEnrollment extends InputBuyCourseDto {
  finished: boolean;
  finishedModulesIds: string[];
  finishedClassesIds: string[];
  paymentMethod: PaymentMethod;
  finalPrice: number;
  courseId: string;
  studentId: string;
}

import { IsOptional, IsNumber, Min, Max } from "class-validator";

export class InputBuyCourseDto {
  @IsString()
  @IsIn(PaymentMethods)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  installments?: number;
}

export type OutputBuyCourseDto = EnrollmentEntity;

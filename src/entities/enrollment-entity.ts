import { CourseEntity } from "@/entities/course-entity";
import { UserEntity } from "@/entities/user-entity";

export const PaymentMethods = ["credit", "pix", "bankSlip"] as const;

export type PaymentMethod = (typeof PaymentMethods)[number];

export interface EnrollmentEntity {
  id: string;
  finished: boolean;
  finishedModulesIds: string[];
  finishedClassesIds: string[];
  paymentMethod: PaymentMethod;
  course: CourseEntity;
  finalPrice: number;
  courseId: string;
  studentId: string;
  student: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}

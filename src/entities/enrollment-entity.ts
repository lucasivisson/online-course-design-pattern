import { PaymentMethod } from "@prisma/client";
import { CourseEntity } from "./course-entity";
import { UserEntity } from "./user-entity";

export interface EnrollmentEntity {
  id: string;
  finished: boolean;
  finishedModulesIds: string[];
  finishedClassesIds: string[];
  paymentMethod: PaymentMethod;
  finalPrice: number;
  courseId: string;
  course: CourseEntity;
  studentId: string;
  student: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}

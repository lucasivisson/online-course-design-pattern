import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { CreateEnrollment } from "@/business/dto/enrollment/enrollment-dto";

export type InputGetEnrollmentBy = Partial<
  Omit<EnrollmentEntity, "createdAt" | "updatedAt" | "course" | "student">
>;

export interface IEnrollmentRepository {
  create(input: CreateEnrollment): Promise<EnrollmentEntity>;
  getBy(input: InputGetEnrollmentBy): Promise<EnrollmentEntity | null>;
  updateBy(input: InputGetEnrollmentBy): Promise<EnrollmentEntity | null>;
}

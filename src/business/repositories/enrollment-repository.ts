import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { CreateEnrollment } from "@/business/dto/enrollment/enrollment-dto";

export interface IEnrollmentRepository {
  create(input: CreateEnrollment): Promise<EnrollmentEntity>;
}

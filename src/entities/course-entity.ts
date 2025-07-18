import { ModuleEntity } from "@/entities/module-entity";
import { PostEntity } from "@/entities/post-entity";
import { UserEntity } from "@/entities/user-entity";
import { EnrollmentEntity } from "@/entities/enrollment-entity";

export interface CourseEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  professorId: string;
  professor?: UserEntity;
  modulesIds: string[];
  modules?: ModuleEntity[];
  posts?: PostEntity[];
  enrollments?: Omit<EnrollmentEntity, "course">[];
  createdAt: Date;
  updatedAt: Date;
}

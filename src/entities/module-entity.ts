import { Class } from "@prisma/client";
import { CourseEntity } from "@/entities/course-entity";

export interface ModuleEntity {
  id: string;
  name: string;
  classes: Class[];
  courseId?: string | null;
  course?: CourseEntity;
  createdAt: Date;
  updatedAt: Date;
}

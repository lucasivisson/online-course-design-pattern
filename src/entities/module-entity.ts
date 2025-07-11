import { Class } from "@prisma/client";
import { CourseEntity } from "@/entities/course-entity";

export interface ModuleEntity {
  id: string;
  name: string;
  classes: Class[];
  coursesIds?: string[];
  course?: CourseEntity;
  createdAt: Date;
  updatedAt: Date;
}

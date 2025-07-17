import {
  InputCreateCourseDto,
  InputUpdateCourseDto,
  InputDeleteCourseDto,
  InputGetCourseDto,
} from "@/business/dto/course/course-dto";
import { CourseEntity } from "@/entities/course-entity";

export type InputGetCourseBy = Partial<
  Omit<
    CourseEntity,
    "createdAt" | "updatedAt" | "modules" | "posts" | "Enrollments"
  >
>;

export interface ICourseRepository {
  create(input: InputCreateCourseDto): Promise<CourseEntity>;
  list(): Promise<CourseEntity[]>;
  get(input: InputGetCourseDto): Promise<CourseEntity | null>;
  update(input: InputUpdateCourseDto): Promise<CourseEntity>;
  delete(input: InputDeleteCourseDto): Promise<void>;
  getBy(input: InputGetCourseBy): Promise<CourseEntity | null>;
  getById(id: string): Promise<CourseEntity | null>;
  listCoursesFromTeacherId(id: string): Promise<CourseEntity[]>;
}

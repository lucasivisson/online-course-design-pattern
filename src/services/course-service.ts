import { CourseEntity } from "@/entities/course-entity";
import { api } from "@/config/api";
import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { InputBuyCourseDto } from "@/business/dto/enrollment/enrollment-dto";

export class CourseService {
  static async getCourses(): Promise<CourseEntity[]> {
    try {
      const response = await api.get<{ course: CourseEntity[] }>("/api/course");
      return response.course;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to fetch courses");
    }
  }

  static async getCourseById(id: string): Promise<CourseEntity> {
    try {
      const response = await api.get<CourseEntity>(`/api/course/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to fetch course");
    }
  }

  static async buyCourse(
    id: string,
    data: InputBuyCourseDto
  ): Promise<EnrollmentEntity> {
    const response = await api.post<EnrollmentEntity>(
      `/api/enrollment/${id}`,
      data
    );
    return response;
  }
}

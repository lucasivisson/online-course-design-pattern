import { CourseEntity } from "@/entities/course-entity";
import { api } from "@/config/api";
import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { InputBuyCourseDto } from "@/business/dto/enrollment/enrollment-dto";

export class CourseService {
  static async getCourses(): Promise<CourseEntity[]> {
    try {
      const response = await api.get<{ data: CourseEntity[] }>(`/api/course`);

      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to fetch courses");
    }
  }

  static async getUserCourses(userId: string): Promise<EnrollmentEntity[]> {
    try {
      const response = await api.get<{ data: EnrollmentEntity[] }>(
        `/api/enrollment/user-progress?userId=${userId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to fetch courses");
    }
  }

  static async getCourseById(id: string): Promise<CourseEntity> {
    try {
      const response = await api.get<{ data: CourseEntity }>(
        `/api/course/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to fetch course");
    }
  }

  static async buyCourse(
    id: string,
    userId: string,
    data: InputBuyCourseDto
  ): Promise<EnrollmentEntity> {
    const response = await api.post<{ data: EnrollmentEntity }>(
      `/api/enrollment/${id}?userId=${userId}`,
      data
    );
    return response.data;
  }

  static async getCoursesFromTeacher(
    id: string,
    userId: string
  ): Promise<EnrollmentEntity> {
    const response = await api.get<{ data: EnrollmentEntity }>(
      `/api/courses/teacher/${id}?userId=${userId}`
    );
    return response.data;
  }
}

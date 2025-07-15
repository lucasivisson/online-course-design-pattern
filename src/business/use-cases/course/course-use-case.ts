import {
  InputCreateCourseDto,
  InputDeleteCourseDto,
  InputGetCourseDto,
  InputUpdateCourseDto,
  OutputCreateCourseDto,
  OutputDeleteCourseDto,
  OutputGetCourseDto,
  OutputListCourseDto,
  OutputUpdateCourseDto,
} from "@/business/dto/course/course-dto";
import { ICourseRepository } from "@/business/repositories/course-repository";
import { IUserRepository } from "@/business/repositories/user-repository";

export class CourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  async list(): Promise<OutputListCourseDto> {
    return await this.courseRepository.list();
  }

  async create(data: InputCreateCourseDto): Promise<OutputCreateCourseDto> {
    if (data.professorId) {
      const user = await this.userRepository.getBy({ id: data.professorId });

      if (!user || user.role !== "professor")
        throw new Error("Invalid teacher id. Please provide a valid id.");
    }

    const course = await this.courseRepository.create(data);

    return (await this.courseRepository.get({ courseId: course.id }))!;
  }

  async get(data: InputGetCourseDto): Promise<OutputGetCourseDto> {
    return await this.courseRepository.get(data);
  }

  async update(data: InputUpdateCourseDto): Promise<OutputUpdateCourseDto> {
    if (data.professorId) {
      const user = await this.userRepository.getBy({ id: data.professorId });

      if (!user || user.role !== "professor")
        throw new Error("Invalid teacher id. Please provide a valid id.");
    }
    const course = await this.courseRepository.update(data);

    return (await this.courseRepository.get({ courseId: course.id }))!;
  }

  async delete(data: InputDeleteCourseDto): Promise<OutputDeleteCourseDto> {
    return await this.courseRepository.delete(data);
  }
}

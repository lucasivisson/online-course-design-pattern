import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  Min,
  IsOptional,
} from "class-validator";
import { CourseEntity } from "@/entities/course-entity";

export class InputCreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  professorId: string;

  @IsInt()
  @Min(0)
  price: number;
}

export class InputUpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  professorId?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsArray()
  @IsOptional()
  modulesIds?: string[];
}

export class InputGetCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

export class InputDeleteCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

export type OutputCreateCourseDto = CourseEntity;
export type OutputUpdateCourseDto = CourseEntity;
export type OutputGetCourseDto = CourseEntity | null;
export type OutputListCourseDto = CourseEntity[];
export type OutputDeleteCourseDto = void;

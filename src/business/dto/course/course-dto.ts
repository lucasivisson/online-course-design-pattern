import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsOptional,
} from "class-validator";
import { CourseEntity } from "@/entities/course-entity";
import { InputCreateModuleDto } from "@/business/dto/module/module-dto";

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputCreateModuleDto)
  modules: InputCreateModuleDto[];
}

export class InputUpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  professorId?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputCreateModuleDto)
  @IsOptional()
  modules?: InputCreateModuleDto[];
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

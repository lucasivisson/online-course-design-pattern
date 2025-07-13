import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ModuleEntity } from "@/entities/module-entity";

export enum ClassType {
  VIDEO = "video",
  TEXT = "text",
  QUIZ = "quiz",
}

export class ClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ClassType)
  type: ClassType;

  @IsOptional()
  @IsString()
  videoUrl?: string | null;

  @IsOptional()
  @IsString()
  textContent?: string | null;

  @IsOptional()
  @IsString()
  quizId?: string | null;
}

export class InputCreateModuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  coursesIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ClassDto)
  classes: ClassDto[];
}

export class InputUpdateModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  coursesIds: string[];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ClassDto)
  classes?: ClassDto[];
}

export class InputGetModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

export class InputDeleteModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

export type OutputCreateModuleDto = ModuleEntity;
export type OutputUpdateModuleDto = ModuleEntity;
export type OutputGetModuleDto = ModuleEntity | null;
export type OutputListModuleDto = ModuleEntity[];
export type OutputDeleteModuleDto = void;

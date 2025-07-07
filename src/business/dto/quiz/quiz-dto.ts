import { QuizEntity } from "@/entities/quiz-entity";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  alternatives: string[];

  @IsInt()
  @Min(0)
  correctAnswer: number;
}

export class InputCreateQuizDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class InputGetQuizDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;
}

export class InputUpdateQuizDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class InputDeleteQuizDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;
}

export type OutputUpdateQuizDto = QuizEntity;
export type OutputDeleteQuizDto = void;
export type OutputGetQuizDto = QuizEntity | null;
export type OutputListQuizDto = QuizEntity[];
export type OutputCreateQuizDto = QuizEntity;

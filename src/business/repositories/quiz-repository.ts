import {
  InputCreateQuizDto,
  InputDeleteQuizDto,
  InputGetQuizDto,
  InputUpdateQuizDto,
} from "@/business/dto/quiz/quiz-dto";
import { QuizEntity } from "@/entities/quiz-entity";

export type InputGetQuizBy = Partial<
  Omit<QuizEntity, "createdAt" | "updatedAt" | "course" | "student">
>;

export interface IQuizRepository {
  create(input: InputCreateQuizDto): Promise<QuizEntity>;
  list(): Promise<QuizEntity[]>;
  get(input: InputGetQuizDto): Promise<QuizEntity | null>;
  update(input: InputUpdateQuizDto): Promise<QuizEntity>;
  delete(input: InputDeleteQuizDto): Promise<void>;
  getBy(input: InputGetQuizBy): Promise<QuizEntity | null>;
}

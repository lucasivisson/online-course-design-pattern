import {
  InputCreateQuizDto,
  InputDeleteQuizDto,
  InputGetQuizDto,
  InputUpdateQuizDto,
} from "@/business/dto/quiz/quiz-dto";
import { QuizEntity } from "@/entities/quiz-entity";

export interface IQuizRepository {
  create(input: InputCreateQuizDto): Promise<QuizEntity>;
  list(): Promise<QuizEntity[]>;
  get(input: InputGetQuizDto): Promise<QuizEntity | null>;
  update(input: InputUpdateQuizDto): Promise<QuizEntity>;
  delete(input: InputDeleteQuizDto): Promise<void>;
}

import {
  OutputListQuizDto,
  InputCreateQuizDto,
  OutputCreateQuizDto,
  InputGetQuizDto,
  OutputGetQuizDto,
  OutputUpdateQuizDto,
  InputUpdateQuizDto,
  InputDeleteQuizDto,
  OutputDeleteQuizDto,
} from "@/business/dto/quiz/quiz-dto";
import { IQuizRepository } from "@/business/repositories/quiz-repository";

export class QuizUseCase {
  constructor(private quizRepository: IQuizRepository) {}

  async list(): Promise<OutputListQuizDto> {
    return await this.quizRepository.list();
  }

  async create(data: InputCreateQuizDto): Promise<OutputCreateQuizDto> {
    return await this.quizRepository.create(data);
  }

  async get(data: InputGetQuizDto): Promise<OutputGetQuizDto> {
    return await this.quizRepository.get(data);
  }

  async update(data: InputUpdateQuizDto): Promise<OutputUpdateQuizDto> {
    return await this.quizRepository.update(data);
  }

  async delete(data: InputDeleteQuizDto): Promise<OutputDeleteQuizDto> {
    return await this.quizRepository.delete(data);
  }
}

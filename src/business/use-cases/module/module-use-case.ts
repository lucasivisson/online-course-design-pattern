import {
  InputCreateModuleDto,
  InputDeleteModuleDto,
  InputGetModuleDto,
  InputUpdateModuleDto,
  OutputCreateModuleDto,
  OutputDeleteModuleDto,
  OutputGetModuleDto,
  OutputListModuleDto,
  OutputUpdateModuleDto,
} from "@/business/dto/module/module-dto";
import { IModuleRepository } from "@/business/repositories/module-repository";
import { IQuizRepository } from "@/business/repositories/quiz-repository";

export class ModuleUseCase {
  constructor(
    private moduleRepository: IModuleRepository,
    private quizRepository: IQuizRepository
  ) {}

  async list(): Promise<OutputListModuleDto> {
    return await this.moduleRepository.list();
  }

  async create(data: InputCreateModuleDto): Promise<OutputCreateModuleDto> {
    let invalidQuiz = false;

    if (data.classes && data.classes.length > 0) {
      for (let index = 0; index < data.classes.length; index++) {
        if (data.classes[index].quizId) {
          const quiz = await this.quizRepository.get({
            quizId: data.classes[index].quizId!,
          });

          if (!quiz && !invalidQuiz) {
            invalidQuiz = true;
          }
        }
      }

      if (invalidQuiz) {
        throw new Error(
          "Invalid quiz. Please provide an id that matches with a quiz."
        );
      }
    }

    return await this.moduleRepository.create(data);
  }

  async get(data: InputGetModuleDto): Promise<OutputGetModuleDto> {
    return await this.moduleRepository.get(data);
  }

  async update(data: InputUpdateModuleDto): Promise<OutputUpdateModuleDto> {
    let invalidQuiz = false;

    if (data.classes && data.classes.length > 0) {
      for (let index = 0; index < data.classes.length; index++) {
        if (data.classes[index].quizId) {
          const quiz = await this.quizRepository.get({
            quizId: data.classes[index].quizId!,
          });

          if (!quiz && !invalidQuiz) {
            invalidQuiz = true;
          }
        }
      }

      if (invalidQuiz) {
        throw new Error(
          "Invalid quiz. Please provide an id that matches with a quiz."
        );
      }
    }
    return await this.moduleRepository.update(data);
  }

  async delete(data: InputDeleteModuleDto): Promise<OutputDeleteModuleDto> {
    return await this.moduleRepository.delete(data);
  }
}

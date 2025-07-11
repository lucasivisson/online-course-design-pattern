import "reflect-metadata";
import {
  ClassType,
  InputCreateModuleDto,
  InputDeleteModuleDto,
  InputGetModuleDto,
  InputUpdateModuleDto,
} from "@/business/dto/module/module-dto";
import { NextRequest } from "next/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { errorHandler } from "@/shared/http-handler";
import { ModuleUseCase } from "@/business/use-cases/module/module-use-case";
import { PrismaModuleRepository } from "@/framework/repositories/prisma-module-repository";
import { PrismaQuizRepository } from "@/framework/repositories/prisma-quiz-repository";
import { ModulePrototypeFactory } from "@/business/prototype/module-prototype";

export class ModuleController {
  private moduleUseCase: ModuleUseCase;

  constructor() {
    this.moduleUseCase = new ModuleUseCase(
      new PrismaModuleRepository(),
      new PrismaQuizRepository()
    );
  }

  async list() {
    try {
      const data = await this.moduleUseCase.list();

      return new Response(JSON.stringify({ module: data }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao consultar módulo:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async get(data: InputGetModuleDto) {
    try {
      const dto = plainToInstance(InputGetModuleDto, data);
      const response = await this.moduleUseCase.get(dto);
      return new Response(JSON.stringify({ module: response }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao consultar módulo:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async create(req: NextRequest) {
    try {
      const data = await req.json();

      const dto = plainToInstance(InputCreateModuleDto, data);

      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const moduleCreated = await this.moduleUseCase.create(dto);

      return new Response(JSON.stringify({ ...moduleCreated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao criar módulo:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async update(req: NextRequest, moduleId: string) {
    try {
      const data = await req.json();

      const dto = plainToInstance(InputUpdateModuleDto, {
        ...data,
        moduleId,
      });
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const moduleUpdated = await this.moduleUseCase.update(dto);

      return new Response(JSON.stringify({ ...moduleUpdated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar módulo:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async delete(data: InputDeleteModuleDto) {
    try {
      const dto = plainToInstance(InputDeleteModuleDto, data);
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      await this.moduleUseCase.delete(dto);

      return new Response(undefined, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao excluir módulo:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  async duplicate(req: NextRequest, moduleId: string) {
    try {
      // Obter o módulo original
      const originalModule = await this.moduleUseCase.get({ moduleId });
      if (!originalModule) {
        return new Response(
          JSON.stringify({
            message: "Módulo não encontrado.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Usar o prototype para criar uma cópia
      const prototype = ModulePrototypeFactory.create(originalModule);
      const clonedModule = prototype.clone().getClonedModule();

      // Criar o novo módulo no banco de dados
      const moduleDuplicated = await this.moduleUseCase.create({
        name: clonedModule.name,
        classes: clonedModule.classes.map((cls) => ({
          name: cls.name,
          type: cls.type as ClassType,
          videoUrl: cls.videoUrl || undefined,
          textContent: cls.textContent || undefined,
          quizId: cls.quizId || undefined,
        })),
        coursesIds: clonedModule.coursesIds || [],
      });

      return new Response(JSON.stringify({ ...moduleDuplicated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao duplicar módulo:", error);
      return new Response(
        JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}

import { UserUseCase } from "@/business/use-cases/user/users-use-case";
import { PrismaUserRepository } from "@/framework/repositories/mongo-user-repository";
import { InputCreateUserDto } from "@/business/dto/user/create-user-dto";
import { NextRequest } from "next/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { errorHandler } from "@/shared/http-handler";

export class UserController {
  private userUseCase: UserUseCase;

  constructor() {
    this.userUseCase = new UserUseCase(new PrismaUserRepository());
  }

  async list() {
    try {
      const users = await this.userUseCase.list();

      return new Response(JSON.stringify({ users }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao consultar usuários:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }

  async create(req: NextRequest) {
    try {
      const user = await req.json();

      const dto = plainToInstance(InputCreateUserDto, user);
      const errors = await validate(dto);

      if (errors.length > 0) return errorHandler(errors);

      const userCreated = await this.userUseCase.create(user);

      return new Response(JSON.stringify({ ...userCreated }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao consultar usuários:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }
}

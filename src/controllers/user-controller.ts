import { UserUseCase } from "@/business/use-cases/user/users-use-case";
import { PrismaUserRepository } from "@/framework/repositories/mongo-user-repository";
import { InputCreateUserDtoIsValid } from "@/business/dto/user/create-user-dto";
import { NextRequest } from "next/server";

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

      if (!InputCreateUserDtoIsValid(user)) {
        return new Response(
          JSON.stringify({ error: "Dados de usuário inválido" }),
          {
            status: 422,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

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

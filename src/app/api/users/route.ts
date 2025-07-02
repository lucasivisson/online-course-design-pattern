import { PrismaUserRepository } from "@/framework/repositories/mongo-user-repository";
import { ListUsersUseCase } from "@/business/use-cases/user/list-users-use-case";

export async function GET() {
  try {
    const userRepository = new PrismaUserRepository();
    const listUsersUseCase = new ListUsersUseCase(userRepository);

    const users = await listUsersUseCase.execute();

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

import { QuizController } from "@/controllers/quiz-controller";
import { NextRequest } from "next/server";

const controller = new QuizController();

type Params = {
  params: Promise<{
    quizId: string;
  }>;
};

export const GET = async (_: NextRequest, { params }: Params) => {
  const { quizId } = await params;
  return controller.get({ quizId });
};
export const DELETE = async (_: NextRequest, { params }: Params) => {
  const { quizId } = await params;
  return controller.delete({ quizId });
};
export const PUT = async (req: NextRequest, { params }: Params) => {
  const { quizId } = await params;
  return controller.update(req, quizId);
};

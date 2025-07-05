import { QuizController } from "@/controllers/quiz-controller";
import { NextRequest } from "next/server";

const controller = new QuizController();

type Params = {
  params: {
    quizId: string;
  };
};

export const GET = (_: NextRequest, { params }: Params) =>
  controller.get({ quizId: params.quizId });
export const DELETE = (_: NextRequest, { params }: Params) =>
  controller.delete({ quizId: params.quizId });
export const PUT = (req: NextRequest, { params }: Params) =>
  controller.update(req, params.quizId);

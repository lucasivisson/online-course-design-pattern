import { QuizController } from "@/controllers/quiz-controller";
import { NextRequest } from "next/server";

const controller = new QuizController();

export const GET = () => controller.list();
export const POST = (req: NextRequest) => controller.create(req);

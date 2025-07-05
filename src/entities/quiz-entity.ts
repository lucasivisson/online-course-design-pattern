import { Question } from "@prisma/client";

export interface QuizEntity {
  id: string;
  name: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

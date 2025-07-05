import { PostEntity } from "@/entities/post-entity"

export interface InputCreatePostDto {
  message: string,
  courseId: string,
  authorId: string,
}

export type OutputCreatePostDto = PostEntity

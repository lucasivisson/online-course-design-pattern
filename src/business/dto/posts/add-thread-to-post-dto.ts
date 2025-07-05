import { PostEntity } from "@/entities/post-entity";

export interface InputAddThreadToPostDto {
  postId: string
  thread: { authorId: string; message: string; }[]
}

export type OutputAddThreadToPostDto = PostEntity
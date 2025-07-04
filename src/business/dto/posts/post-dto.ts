import { PostEntity } from "@/entities/post-entity"

export interface InputCreatePostDto {
  message: string,
  courseId: string,
  authorId: string,
}

export type OutputCreatePostDto = PostEntity

export interface InputAddThreadToPostDto {
  postId: string
  thread: { authorId: string; message: string; }[]
}

export type OutputAddThreadToPostDto = PostEntity

export interface InputDeletePostDto {
  userId: string
  postId: string
}

export type OutputDeletePostDto = void
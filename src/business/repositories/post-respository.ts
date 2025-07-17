import { FileEntity } from "@/entities/file-entity";
import { PostEntity } from "@/entities/post-entity"

export type InputCreateUpdatePost = {
  message: string | null,
  courseId: string,
  authorId: string,
  authorName: string,
  file: FileEntity | null
  thread: { authorId: string, authorName: string, message: string | null, file: {
    fileName: string;
    type: string;
    url: string;
  } | null }[]
}

export type InputUpdatePost = {
  postId: string
  dataToUpdate: Partial<InputCreateUpdatePost>
}

export type InputFindPostById = {
  postId: string
}

export type InputDeletePostById = {
  postId: string
}

export type InputFindManyByCourseId = {
  courseId: string
}

export interface IPostRepository {
  create(input: InputCreateUpdatePost): Promise<PostEntity>
  update(input: InputUpdatePost): Promise<PostEntity>
  findById(input: InputFindPostById): Promise<PostEntity | null>
  delete(input: InputDeletePostById): Promise<void>
  findManyByCourseId(input: InputFindManyByCourseId): Promise<PostEntity[]>
}
import { PostEntity } from "@/entities/post-entity"

export type InputCreateUpdatePost = {
  message: string | null,
  courseId: string,
  authorId: string,
  file: { fileBuffer: Uint8Array, fileName: string, type: string } | null
  thread: { authorId: string, message: string | null, file: {
      fileBuffer: Uint8Array;
      fileName: string;
      type: string;
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

export interface IPostRepository {
  create(input: InputCreateUpdatePost): Promise<PostEntity>
  update(input: InputUpdatePost): Promise<PostEntity>
  findById(input: InputFindPostById): Promise<PostEntity | null>
  delete(input: InputDeletePostById): Promise<void>
}
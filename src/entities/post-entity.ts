import { FileEntity } from "./file-entity";

export interface PostEntity {
  id: string,
  message: string | null,
  courseId: string,
  authorId: string,
  file: FileEntity | null
  thread?: { authorId: string; message: string | null; file: FileEntity | null }[]
  createdAt: Date,
  updatedAt: Date,
}
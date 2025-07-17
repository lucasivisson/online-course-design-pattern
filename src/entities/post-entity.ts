import { FileEntity } from "./file-entity";

export interface PostEntity {
  id: string,
  message: string | null,
  courseId: string,
  authorId: string,
  authorName: string;
  file: FileEntity | null
  thread: { authorId: string; authorName: string; message: string | null; file: FileEntity | null, createdAt: Date }[]
  createdAt: Date,
  updatedAt: Date,
}
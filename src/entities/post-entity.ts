export interface PostEntity {
  id: string,
  message: string,
  courseId: string,
  authorId: string,
  createdAt: Date,
  updatedAt: Date,
  thread?: { authorId: string; message: string; }[]
}
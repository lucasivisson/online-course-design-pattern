import { FileEntity } from "@/entities/file-entity";
import { PostEntity } from "@/entities/post-entity";
import { IsDefined, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

class File implements FileEntity {
  @IsNotEmpty()
  @IsString()
  fileName: string

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsDefined()
  fileBuffer: Uint8Array
}

export class InputCreatePostDto {
  @IsOptional()
  @IsString()
  message: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsOptional()
  @IsObject()
  file: File
}

export type OutputCreatePostDto = void

export class InputDeletePostDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  postId: string
}

export type OutputDeletePostDto = void

class Thread {
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsObject()
  file: File
}

export class InputAddThreadToPostDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  postId: string

  @IsObject()
  @IsNotEmpty()
  thread: Thread
}

export type OutputAddThreadToPostDto = void


export class InputListPostsDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsObject()
  @IsNotEmpty()
  courseId: string
}

export type OutputListPostsDto = PostEntity[]

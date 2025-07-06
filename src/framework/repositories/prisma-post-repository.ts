import { prisma } from "@/framework/database/prisma"
import { InputCreateUpdatePost, InputDeletePostById, InputFindManyByCourseId, InputFindPostById, InputUpdatePost, IPostRepository } from "@/business/repositories/post-respository"
import { PostEntity } from "@/entities/post-entity"

export class PrismaPostRepository implements IPostRepository {
  async create(input: InputCreateUpdatePost): Promise<PostEntity> {
    const post = await prisma.post.create({
      data: input,
    })

    return post
  }

  async update(input: InputUpdatePost): Promise<PostEntity> {
    const post = await prisma.post.update({
      where: { id: input.postId },
      data: input.dataToUpdate
    })

    return post
  }

  async findById(input: InputFindPostById): Promise<PostEntity | null> {
    const post = await prisma.post.findFirst({
      where: { id: input.postId },
    })

    return post
  }

  async delete(input: InputDeletePostById): Promise<void> {
    await prisma.post.delete({
      where: { id: input.postId },
    })
  }

  async findManyByCourseId(input: InputFindManyByCourseId): Promise<PostEntity[]> {
    return await prisma.post.findMany({
      where: {
        courseId: input.courseId
      }
    });
  }
}
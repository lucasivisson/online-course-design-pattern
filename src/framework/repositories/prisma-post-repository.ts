import { prisma } from "@/framework/database/prisma"
import { InputCreateUpdatePost, InputDeletePostById, InputFindManyByCourseId, InputFindPostById, InputGetPostBy, InputUpdatePost, IPostRepository } from "@/business/repositories/post-respository"
import { PostEntity } from "@/entities/post-entity"
import { isValidObjectId } from "@/shared/isObjectId"
import { Prisma } from "@prisma/client"

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
    try {
      console.log(input.postId);
      if (!isValidObjectId(input.postId)) return null;
        
      const post = await prisma.post.findFirst({
        where: { id: input.postId },
      })

      return post
    } catch (err) {
      console.log("Erro ao buscar post no repositório:", err);
      throw err;
    }
  }

  async getBy(input: InputGetPostBy): Promise<PostEntity | null> {
    if (input.id && !isValidObjectId(input.id)) {
      return null;
    }

    return await prisma.post.findUnique({
      where: input as Prisma.PostWhereUniqueInput,
    });
  }

  async delete(input: InputDeletePostById): Promise<void> {
    try {
      await prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
    } catch (err) {
      console.log("Erro ao deletar post no repositório:", err);
      throw err;
    }
  }

  async findManyByCourseId(input: InputFindManyByCourseId): Promise<PostEntity[]> {
    return await prisma.post.findMany({
      where: {
        courseId: input.courseId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
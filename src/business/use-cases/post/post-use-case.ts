import { InputAddThreadToPostDto, InputCreatePostDto, InputDeletePostDto, InputListPostsDto, OutputCreatePostDto, OutputDeletePostDto, OutputListPostsDto } from "@/business/dto/posts/posts-dto"
import { PostIsNotFromAuthor, PostNotFound } from "@/business/errors/posts"
import { IPostRepository } from "@/business/repositories/post-respository"

export class PostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async create(input: InputCreatePostDto): Promise<OutputCreatePostDto> {
    // verify if user is on the course or not to create a post later
    await this.postRepository.create({ ...input, thread: [] })
  }

  async addThreadOnPost(input: InputAddThreadToPostDto): Promise<OutputCreatePostDto> {
    // verify if user is on the course or not to create a thread on post later
    const post = await this.postRepository.findById({ postId: input.postId })
    if(!post) {
      throw new Error(JSON.stringify(PostNotFound))
    }

    const newThreads = post.thread ? [ ...post.thread, input.thread ] : [input.thread]
    await this.postRepository.update({ postId: input.postId, dataToUpdate: { thread: newThreads }})
  }

  async delete(input: InputDeletePostDto): Promise<OutputDeletePostDto> {
    // verify if user is on the course to delete a post later
    const post = await this.postRepository.findById({ postId: input.postId })
    if(!post) {
      throw new Error(JSON.stringify(PostNotFound))
    }
    if(input.userId !== post.authorId) {
      throw new Error(JSON.stringify(PostIsNotFromAuthor))
    }
    await this.postRepository.delete({ postId: input.postId })
  }

  async list(input: InputListPostsDto): Promise<OutputListPostsDto> {
    // verify if user is on the course or not later
    return await this.postRepository.findManyByCourseId({ courseId: input.courseId })
  }
}
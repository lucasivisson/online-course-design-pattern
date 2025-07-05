import { InputAddThreadToPostDto, InputCreatePostDto, InputDeletePostDto, OutputCreatePostDto, OutputDeletePostDto } from "@/business/dto/posts/post-dto"
import { PostIsNotFromAuthor, PostNotFound } from "@/business/errors/posts"
import { IPostRepository } from "@/business/repositories/post-respository"

export class PostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async create(input: InputCreatePostDto): Promise<OutputCreatePostDto> {
    return await this.postRepository.create({ ...input, thread: [] })
  }

  async addThreadOnPost(input: InputAddThreadToPostDto): Promise<OutputCreatePostDto> {
    const post = await this.postRepository.findById({ postId: input.postId })
    if(!post) {
      throw new Error(JSON.stringify(PostNotFound))
    }

    input.thread = { ...post.thread, ...input.thread }
    return await this.postRepository.update({ postId: input.postId, dataToUpdate: { thread: input.thread }})
  }

  async delete(input: InputDeletePostDto): Promise<OutputDeletePostDto> {
    const post = await this.postRepository.findById({ postId: input.postId })
    if(!post) {
      throw new Error(JSON.stringify(PostNotFound))
    }
    if(input.userId !== post.authorId) {
      throw new Error(JSON.stringify(PostIsNotFromAuthor))
    }
    await this.postRepository.delete({ postId: input.postId })
  }
}
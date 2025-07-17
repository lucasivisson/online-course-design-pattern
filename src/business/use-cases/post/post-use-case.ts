import { InputAddThreadToPostDto, InputCreatePostDto, InputDeletePostDto, InputListPostsDto, OutputCreatePostDto, OutputDeletePostDto, OutputListPostsDto } from "@/business/dto/posts/posts-dto"
import { PostIsNotFromAuthor, PostNotFound } from "@/business/errors/posts"
import { IPostRepository } from "@/business/repositories/post-respository"
import { getCourseMediator } from "@/services/mediator/course-mediator";
import { deleteUploadedFile } from "@/shared/storageService";

export class PostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async create(input: InputCreatePostDto): Promise<OutputCreatePostDto> {
    const mediator = getCourseMediator(input.courseId);
    const postCreatorComponent = mediator.getPostCreatorComponent();
    postCreatorComponent.setMediator(mediator)
    // verify if user is on the course or not to create a post later
    const post = await postCreatorComponent.createPost({ ...input })
    return post
  }

  async addThreadOnPost(input: InputAddThreadToPostDto): Promise<OutputCreatePostDto> {
    // verify if user is on the course or not to create a thread on post later
    const postFounded = await this.postRepository.findById({ postId: input.postId })
    if(!postFounded) {
      throw new Error(JSON.stringify(PostNotFound))
    }

    const mediator = getCourseMediator(postFounded.courseId);
    const addThreadComponent = mediator.getAddThreadComponent();
    addThreadComponent.setMediator(mediator)

    const post = await addThreadComponent.addThread({ authorId: input.userId, courseId: postFounded.courseId, postId: input.postId, file: input.thread.file, message: input.thread.message })
    return post
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
    if(post.file) await deleteUploadedFile(post.file?.url)
  }

  async list(input: InputListPostsDto): Promise<OutputListPostsDto> {
    // verify if user is on the course or not later
    return await this.postRepository.findManyByCourseId({ courseId: input.courseId })
  }
}
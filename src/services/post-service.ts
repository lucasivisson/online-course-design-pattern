import { CourseEntity } from "@/entities/course-entity";
import { api } from "@/config/api";
import { PostEntity } from "@/entities/post-entity";

export type InputCreatePost = { courseId: string, message?: string, file?: File, userId: string }

export class PostService {
  static async create(input: InputCreatePost): Promise<PostEntity> {
    try {
      const formData = new FormData();
      if (input.message) formData.append("message", input.message);
      formData.append("courseId", input.courseId);

      if (input.file) formData.append("file", input.file);

      if(!input.message && !input.file) {
        throw new Error("Any attribute need to be passed");
      }

      const response = await api.post<{post: PostEntity}>(`/api/posts?userId=${input.userId}`, formData);
      return response.post
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to create post");
    }
  }

  static async index(input: { courseId: string, userId: string }): Promise<PostEntity[]> {
    try {
      const response = await api.get<PostEntity[]>(`/api/posts/course/${input.courseId}?userId=${input.userId}`);
      return response;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  static async addThreadOnPost(input: { postId: string, message?: string, file?: File, userId: string }): Promise<PostEntity> {
    try {
      const formData = new FormData();
      if (input.message) formData.append("message", input.message);

      if (input.file) formData.append("file", input.file);

      if(!input.message && !input.file) {
        throw new Error("Any attribute need to be passed");
      }
      const response = await api.patch<{ post: PostEntity }>(`/api/posts/${input.postId}?userId=${input.userId}`, formData);
      return response.post
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to add thread on post");
    }
  }

  static async delete(input: { postId: string, userId: string }): Promise<unknown> {
    try {
      await api.delete<CourseEntity>(`/api/posts/${input.postId}?userId=${input.userId}`);
      return {}
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to add thread on post");
    }
  }
}

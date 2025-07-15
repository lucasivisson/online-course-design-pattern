import { CourseEntity } from "@/entities/course-entity";
import { api } from "@/config/api";
import { PostEntity } from "@/entities/post-entity";

export type InputCreatePost = { courseId: string, authorId: string, message?: string, file?: File }

export class PostService {
  static async create(input: InputCreatePost): Promise<unknown> {
    try {
      const formData = new FormData();
      if (input.message) formData.append("message", input.message);
      formData.append("courseId", input.courseId);

      if (input.file) formData.append("file", input.file);

      if(!input.message && !input.file) {
        throw new Error("Any attribute need to be passed");
      }  

      await api.post("/api/posts", formData);
      return {}
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to create post");
    }
  }

  static async index(input: { courseId: string }): Promise<PostEntity[]> {
    try {
      const response = await api.get<{ posts: PostEntity[] }>(`/api/posts/course/${input.courseId}`);
      return response.posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  static async addThreadOnPost(input: { postId: string, message?: string, file?: File }): Promise<unknown> {
    try {
      const formData = new FormData();
      if (input.message) formData.append("message", input.message);

      if (input.file) formData.append("file", input.file);

      if(!input.message && !input.file) {
        throw new Error("Any attribute need to be passed");
      }
      await api.patch(`/api/posts/${input.postId}`, formData);
      return {}
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to add thread on post");
    }
  }

  static async delete(input: { postId: string }): Promise<unknown> {
    try {
      await api.delete<CourseEntity>(`/api/posts/${input.postId}`);
      return {}
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to add thread on post");
    }
  }
}

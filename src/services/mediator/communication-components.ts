import { FileEntity } from "@/entities/file-entity";
import { Mediator } from "./mediator-interface";
import { BaseComponent } from "./mediator-interface";
import { PostEntity } from "@/entities/post-entity";

type FileInput = Omit<FileEntity, "url"> & {
  fileBuffer: Uint8Array
}

/**
 * Componente responsável por iniciar a criação de um Post.
 * Não sabe como o Post é criado ou notificado, apenas informa ao Mediator.
 */
class PostCreatorComponent extends BaseComponent {
    constructor(mediator?: Mediator) {
      super(mediator);
    }

    public async createPost({authorId, courseId, message, file}: { authorId: string, courseId: string, message?: string, file?: FileInput }): Promise<PostEntity | undefined> {
      if (!this.mediator) {
        throw new Error('Mediator not set for PostCreatorComponent.');
      }
      console.log(`PostCreatorComponent: Iniciando criação de post para curso ${courseId}.`);
      const post = await this.mediator.notify(this, 'createPost', { authorId, courseId, message, file });
      return post
    }
}

/**
 * Componente responsável por iniciar a adição de uma Thread a um Post existente.
 * Não sabe como a Thread é persistida ou quem será notificado, apenas informa ao Mediator.
 */
class AddThreadComponent extends BaseComponent {
    constructor(mediator?: Mediator) {
      super(mediator);
    }

    public async addThread({ postId, authorId, courseId, message, file }: {postId: string, authorId: string, courseId: string, message?: string, file?: FileInput}): Promise<PostEntity | undefined> {
      if (!this.mediator) {
        throw new Error('Mediator not set for ThreadAdderComponent.');
      }
      console.log(`ThreadAdderComponent: Iniciando adição de thread ao post ${postId}.`);
      const post = await this.mediator.notify(this, 'addThread', { postId, authorId, courseId, message, file });
      return post
    }
}

export { PostCreatorComponent, AddThreadComponent };
export type { FileInput };

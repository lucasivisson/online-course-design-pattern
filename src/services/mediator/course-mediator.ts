/* eslint-disable @typescript-eslint/no-explicit-any */
// services/courseMediator.ts
import { IPostRepository } from '@/business/repositories/post-respository';
import { IUserRepository } from '@/business/repositories/user-repository';
import { ICourseRepository } from '@/business/repositories/course-repository';
import { PrismaUserRepository } from '@/framework/repositories/mongo-user-repository';
import { PrismaCourseRepository } from '@/framework/repositories/prisma-course-repository';
import { PrismaPostRepository } from '@/framework/repositories/prisma-post-repository';
import { BaseComponent, Mediator } from './mediator-interface';
import { getCourseNotificationObserver } from '../observer/notification-observer';
import { AddThreadComponent, PostCreatorComponent } from './communication-components';

// Para o Next.js, é importante garantir que o mapa de mediadores seja um singleton global
declare global {
  var courseMediatorsGlobal: { [courseId: string]: CourseMediator } | undefined;
}

class CourseMediator implements Mediator {
  private courseId: string;
  private postCreatorComponent: PostCreatorComponent;
  private threadAdderComponent: AddThreadComponent;
  public userRepository: IUserRepository
  public postRepository: IPostRepository
  public courseRepository: ICourseRepository

  // No construtor, o Mediator "conhece" os componentes que ele vai coordenar.
  // No seu caso, são componentes abstratos de "ações".
  constructor(courseId: string, userRepository: IUserRepository, courseRepository: ICourseRepository, postRepository: IPostRepository) {

    this.courseId = courseId;
    this.postCreatorComponent = new PostCreatorComponent();
    this.threadAdderComponent = new AddThreadComponent();
    this.userRepository = userRepository
    this.courseRepository = courseRepository
    this.courseRepository = courseRepository
    this.postRepository = postRepository

    // O mediador se "seta" como o mediador desses componentes
    this.postCreatorComponent.setMediator(this);
    this.threadAdderComponent.setMediator(this);
  }

  // O método principal que o Mediator usa para reagir a eventos dos componentes.
  public async notify(sender: BaseComponent, event: string, payload?: any): Promise<void> {
    console.log(`Mediator para curso ${this.courseId}: Recebeu evento "${event}" do sender:`, sender.constructor.name);

    // Lógica para criar um Post
    if (event === 'createPost' && sender instanceof PostCreatorComponent) {
      const { authorId, courseId, message, file } = payload;
      if (!message && !file) {
        throw new Error('Um post deve ter uma mensagem ou um arquivo.');
      }

      const newPost = await this.postRepository.create({
        courseId: courseId,
        authorId: authorId,
        message: message,
        file: file ? {
          fileBuffer: file.fileBuffer,
          fileName: file.fileName,
          type: file.type,
        } : null,
        thread: []
      });

      // Notificar todos os participantes do curso (via Observer)
      const notificationObserver = getCourseNotificationObserver(courseId);
      const author = await this.userRepository.getBy({ id: authorId });
      const course = await this.courseRepository.get({ courseId: courseId });

      if (author && course) {
        const postContentSummary = message ? message.substring(0, 50) + '...' : 'um arquivo anexo.';
        const notificationMessage = `"${author.name}" postou: "${postContentSummary}" no curso "${course.name}"!`;
        await notificationObserver.notify(notificationMessage, authorId);
      }

      console.log(`Mediator: Post ${newPost.id} criado e notificação disparada.`);
    }

    // Lógica para adicionar uma Thread
    if (event === 'addThread' && sender instanceof AddThreadComponent) {
      const { postId, authorId, courseId, message, file } = payload;
      if (!message && !file) {
        throw new Error('Uma resposta (thread) deve ter uma mensagem ou um arquivo.');
      }

      const post = await this.postRepository.findById({ postId });
      // select: { courseId: true, authorId: true }

      if (!post) {
        throw new Error('Post não encontrado.');
      }

      const newThreadData = {
        authorId: authorId,
        message: message || null,
        file: file ? {
          fileBuffer: file.fileBuffer,
          fileName: file.fileName,
          type: file.type,
        } : null,
      };

      const newThread = post.thread ? [...post.thread, newThreadData] : [newThreadData]

      await this.postRepository.update({
        postId,
        dataToUpdate: {
          thread: newThread
        },
      });

      // Notificar o autor do post original e todos os participantes do curso (via Observer)
      const notificationObserver = getCourseNotificationObserver(courseId);
      const author = await this.userRepository.getBy({ id: authorId });
      const course = await this.userRepository.getBy({ id: courseId });

      if (author && course) {
        const threadContentSummary = message ? message.substring(0, 50) + '...' : 'um arquivo anexo.';
        const notificationMessage = `"${author.name}" respondeu: "${threadContentSummary}" em um post no curso "${course.name}"!`;
        await notificationObserver.notify(notificationMessage, authorId);

        // Se precisar de notificação específica para o autor do post, pode ser feito aqui
        // Ex: if (authorId !== post.authorId && post.authorId) { /* Lógica de notificação direta */ }
      }

      console.log(`Mediator: Thread adicionada ao post ${postId} e notificação disparada.`);
    }
  }

  // Métodos para expor os componentes para o uso externo (ex: API Routes)
  public getPostCreatorComponent(): PostCreatorComponent {
    return this.postCreatorComponent;
  }

  public getThreadAdderComponent(): AddThreadComponent {
    return this.threadAdderComponent;
  }
}

// Singleton global para os mediadores de curso, para lidar com a natureza serverless do Next.js API Routes
if (!global.courseMediatorsGlobal) {
  global.courseMediatorsGlobal = {};
}

export const getCourseMediator = (courseId: string): CourseMediator => {
  if (!global.courseMediatorsGlobal![courseId]) {
    const userRepository = new PrismaUserRepository()
    const courseRepository = new PrismaCourseRepository()
    const postRepository = new PrismaPostRepository()
    global.courseMediatorsGlobal![courseId] = new CourseMediator(courseId, userRepository, courseRepository, postRepository);
  }
  return global.courseMediatorsGlobal![courseId];
};
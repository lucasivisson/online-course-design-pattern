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
import { saveFileToDisk } from '@/shared/storageService';
import { PostEntity } from '@/entities/post-entity';

// Para o Next.js, é importante garantir que o mapa de mediadores seja um singleton global
declare global {
  var courseMediatorsGlobal: { [courseId: string]: CourseMediator } | undefined;
}

export interface OutputNotifyMediator {
  post: PostEntity
}

class CourseMediator implements Mediator {
  private courseId: string;
  private postCreatorComponent: PostCreatorComponent;
  private addThreadComponent: AddThreadComponent;
  public userRepository: IUserRepository
  public postRepository: IPostRepository
  public courseRepository: ICourseRepository

  // No construtor, o Mediator "conhece" os componentes que ele vai coordenar.
  // No seu caso, são componentes abstratos de "ações".
  constructor(courseId: string, userRepository: IUserRepository, courseRepository: ICourseRepository, postRepository: IPostRepository) {

    this.courseId = courseId;
    this.postCreatorComponent = new PostCreatorComponent();
    this.addThreadComponent = new AddThreadComponent();
    this.userRepository = userRepository
    this.courseRepository = courseRepository
    this.courseRepository = courseRepository
    this.postRepository = postRepository

    // O mediador se "seta" como o mediador desses componentes
    this.postCreatorComponent.setMediator(this);
    this.addThreadComponent.setMediator(this);
  }

  // O método principal que o Mediator usa para reagir a eventos dos componentes.
  public async notify(sender: BaseComponent, event: string, payload?: any): Promise<PostEntity | undefined> {
    console.log(`Mediator para curso ${this.courseId}: Recebeu evento "${event}" do sender:`, sender.constructor.name);

    // Lógica para criar um Post
    if (event === 'createPost' && sender instanceof PostCreatorComponent) {
      const { authorId, courseId, message, file } = payload;
      if (!message && !file) {
        throw new Error('Um post deve ter uma mensagem ou um arquivo.');
      }

      let fileObject;
      if (file) {
        fileObject = {
          fileName: file.fileName,
          type: file.type,
          url: await saveFileToDisk(Buffer.from(file.fileBuffer), file.fileName)
        }
      }

      const author = await this.userRepository.getBy({ id: authorId });
      const course = await this.courseRepository.get({ courseId: courseId });

      console.log('author', author)
      console.log('course', course)

      if (author && course) {
        const postCreated = await this.postRepository.create({
          courseId: courseId,
          authorId: authorId,
          authorName: author.name,
          message: message,
          file: fileObject ? fileObject : null,
          thread: []
        });

        // Notificar todos os participantes do curso (via Observer)
        const notificationObserver = getCourseNotificationObserver(courseId);

        const postContentSummary = message ? message : 'um arquivo em anexo.';
        const notificationMessage = `${author.name} postou "${postContentSummary}" no curso "${course.name}"!`;
        console.log(`Mediator: Post ${postCreated.id} criado e notificação disparada.`);
        const notification = await notificationObserver.notify(notificationMessage, authorId, authorId);
        console.log('notification disparada', notification?.id)
        console.log('postCreated', postCreated)
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', postCreated)
        return postCreated
      }
    }

    // Lógica para adicionar uma Thread
    if (event === 'addThread' && sender instanceof AddThreadComponent) {
      const { postId, authorId, courseId, message, file } = payload;
      if (!message && !file) {
        throw new Error('Uma resposta (thread) deve ter uma mensagem ou um arquivo.');
      }

      const post = await this.postRepository.getBy({ id: postId });
      // select: { courseId: true, authorId: true }

      if (!post) {
        throw new Error('Post não encontrado.');
      }

      let fileObject;
      if (file) {
        fileObject = {
          fileName: file.fileName,
          type: file.type,
          url: await saveFileToDisk(Buffer.from(file.fileBuffer), file.fileName)
        }
      }

            // Notificar o autor do post original e todos os participantes do curso (via Observer)
      const notificationObserver = getCourseNotificationObserver(courseId);
      const author = await this.userRepository.getBy({ id: authorId });
      const course = await this.courseRepository.getBy({ id: courseId });

      if (author && course) {
        const newThreadData = {
          authorId: authorId,
          authorName: author.name,
          message: message || null,
          file: fileObject ? fileObject : null,
          createdAt: new Date()
        };

        const newThread = post.thread ? [...post.thread, newThreadData] : [newThreadData]

        const postCreated = await this.postRepository.update({
          postId,
          dataToUpdate: {
            thread: newThread
          },
        });

        const threadContentSummary = message ? message : 'um arquivo anexo.';
        const notificationMessage = `${author.name} respondeu "${threadContentSummary}" em um post no curso "${course.name}"!`;
        const notification = await notificationObserver.notify(notificationMessage, authorId, authorId);
                console.log('notification disparada', notification?.id)
        console.log(`Mediator: Thread adicionada ao post ${postId} e notificação disparada.`);
        console.log('postCreated', postCreated)
        return postCreated
        // Se precisar de notificação específica para o autor do post, pode ser feito aqui
        // Ex: if (authorId !== post.authorId && post.authorId) { /* Lógica de notificação direta */ }
      }
    }
  }

  // Métodos para expor os componentes para o uso externo (ex: API Routes)
  public getPostCreatorComponent(): PostCreatorComponent {
    return this.postCreatorComponent;
  }

  public getAddThreadComponent(): AddThreadComponent {
    return this.addThreadComponent;
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
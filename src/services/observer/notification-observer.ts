// services/notificationService.ts
// (Conteúdo anterior do notificationService.ts)
// Ele ainda será responsável por gerenciar os observadores e criar notificações no DB.
// A lógica para `getCourseNotificationSubject` deve ser singleton global.
import { ICourseRepository } from '@/business/repositories/course-repository';
import { INotificationRepository } from '@/business/repositories/notification-repository';
import { IUserRepository } from '@/business/repositories/user-repository';
import { NotificationEntity } from '@/entities/notification-entity';
import { PrismaUserRepository } from '@/framework/repositories/mongo-user-repository';
import { PrismaCourseRepository } from '@/framework/repositories/prisma-course-repository';
import { PrismaNotificationRepository } from '@/framework/repositories/prisma-notification-repository';

interface INotificationObserver {
  attach(userIds: string[]): Promise<void>;
  detach(userId: string): void;
  notify(message: string, senderId: string, 
    // relatedEntityId?: string
  ): Promise<NotificationEntity | void>;
}

class NotificationObserver implements INotificationObserver {
  private observers: string[] = [];
  private courseId: string; // Adicionado para que o refreshObservers saiba qual curso buscar
  private userRepository: IUserRepository
  private courseRepository: ICourseRepository
  private notificationRepository: INotificationRepository

  constructor(courseId: string, userRepository: IUserRepository, courseRepository: ICourseRepository, notificationRepository: INotificationRepository) {
    this.courseId = courseId;
    this.userRepository = userRepository
    this.courseRepository = courseRepository
    this.notificationRepository = notificationRepository
  }

  public async attach(userIds: string[]): Promise<void> {
    const usersToAdd = await this.userRepository.getManyById({
      userIds,
    });
    usersToAdd.forEach(user => {
      if (!this.observers.some(observerId => observerId === user.id)) {
        this.observers.push(user.id);
      }
    });
  }

  public detach(userId: string): void {
    this.observers = this.observers.filter(observerId => observerId !== userId);
  }

  public async notify(
    message: string,
    senderId: string,
    // relatedEntityId?: string
  ): Promise<NotificationEntity | void > {
    if (this.observers.length === 0) {
      console.log('Nenhum observador para notificar.');
      return
    }

    const notificationData = {
      message: message,
      senderId: senderId,
      receiversIds: this.observers.map(observerId => observerId),
      readBy: [],
    };

    const newNotification = await this.notificationRepository.create(notificationData);

    console.log(`Notificação criada para ${this.observers.length} usuários:`, newNotification);
    return newNotification;
  }

  public async refreshObservers(): Promise<void> {
    const course = await this.courseRepository.get({
      courseId: this.courseId
      // where: { id: this.courseId },
      // include: { students: true, teachers: true },
    });

    if (course) {
      this.observers = [course.professorId];
      if(course?.Enrollments) {
        const studentsIds = course.Enrollments?.length > 0 ? course.Enrollments?.map(enrollment => enrollment.studentId) : undefined
        if(studentsIds) {
          this.observers = [...this.observers, ...studentsIds]
        }
      }
    }
  }
}

// Singleton global para os sujeitos de notificação, por curso
declare global {
  var courseNotificationSubjectsGlobal: { [courseId: string]: NotificationObserver } | undefined;
}

if (!global.courseNotificationSubjectsGlobal) {
  global.courseNotificationSubjectsGlobal = {};
}

export const getCourseNotificationObserver = (courseId: string): NotificationObserver => {
  if (!global.courseNotificationSubjectsGlobal![courseId]) {
    const userRepository = new PrismaUserRepository()
    const courseRepository = new PrismaCourseRepository()
    const notificationRepository = new PrismaNotificationRepository()
    global.courseNotificationSubjectsGlobal![courseId] = new NotificationObserver(courseId, userRepository, courseRepository, notificationRepository);
    // Para garantir que os observadores estejam anexados na primeira vez,
    // podemos chamar refreshObservers aqui, ou depender da lógica do Mediator.
    // Chamar aqui garante que o sujeito já esteja "populado"
    global.courseNotificationSubjectsGlobal![courseId].refreshObservers().catch(console.error);
  }
  return global.courseNotificationSubjectsGlobal![courseId];
};

export const updateCourseObservers = async (courseId: string) => {
  const subject = getCourseNotificationObserver(courseId);
  await subject.refreshObservers();
  console.log(`Observadores para o curso ${courseId} atualizados.`);
};
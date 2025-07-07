import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { ModuleEntity } from "@/entities/module-entity";

// Abstract handler for the Chain of Responsibility
export abstract class ProgressHandler {
  protected nextHandler: ProgressHandler | null = null;

  setNext(handler: ProgressHandler): ProgressHandler {
    this.nextHandler = handler;
    return handler;
  }

  abstract canAccess(enrollment: EnrollmentEntity, targetId: string): boolean;
  abstract getType(): string;
}

// Handler for checking if a specific class can be accessed
export class ClassAccessHandler extends ProgressHandler {
  constructor(
    private courseModules: ModuleEntity[],
    private targetClassId: string
  ) {
    super();
  }

  canAccess(enrollment: EnrollmentEntity, targetId: string): boolean {
    if (targetId !== this.targetClassId) {
      return this.nextHandler?.canAccess(enrollment, targetId) ?? true;
    }

    // Find the module that contains this class
    const moduleWithClass = this.courseModules.find((module) =>
      module.classes.some((classItem) => classItem.id === this.targetClassId)
    );

    if (!moduleWithClass) {
      return false;
    }

    // Check if all previous classes in the same module are completed
    const classIndex = moduleWithClass.classes.findIndex(
      (classItem) => classItem.id === this.targetClassId
    );

    if (classIndex === 0) {
      // First class in module - check if previous module is completed
      const moduleIndex = this.courseModules.findIndex(
        (module) => module.id === moduleWithClass.id
      );

      if (moduleIndex === 0) {
        // First module - always accessible
        return true;
      }

      // Check if previous module is completed
      const previousModule = this.courseModules[moduleIndex - 1];
      const isPreviousModuleCompleted = enrollment.finishedModulesIds.includes(
        previousModule.id
      );

      if (!isPreviousModuleCompleted) {
        return false;
      }
    } else {
      // Check if all previous classes in the same module are completed
      const previousClasses = moduleWithClass.classes.slice(0, classIndex);
      const allPreviousClassesCompleted = previousClasses.every((classItem) =>
        enrollment.finishedClassesIds.includes(classItem.id)
      );

      if (!allPreviousClassesCompleted) {
        return false;
      }
    }

    // If this class is accessible, check next handler
    return this.nextHandler?.canAccess(enrollment, targetId) ?? true;
  }

  getType(): string {
    return "ClassAccess";
  }
}

// Handler for checking if a specific module can be accessed
export class ModuleAccessHandler extends ProgressHandler {
  constructor(
    private courseModules: ModuleEntity[],
    private targetModuleId: string
  ) {
    super();
  }

  canAccess(enrollment: EnrollmentEntity, targetId: string): boolean {
    if (targetId !== this.targetModuleId) {
      return this.nextHandler?.canAccess(enrollment, targetId) ?? true;
    }

    const moduleIndex = this.courseModules.findIndex(
      (module) => module.id === this.targetModuleId
    );

    if (moduleIndex === 0) {
      // First module - always accessible
      return this.nextHandler?.canAccess(enrollment, targetId) ?? true;
    }

    // Check if previous module is completed
    const previousModule = this.courseModules[moduleIndex - 1];
    const isPreviousModuleCompleted = enrollment.finishedModulesIds.includes(
      previousModule.id
    );

    if (!isPreviousModuleCompleted) {
      return false;
    }

    return this.nextHandler?.canAccess(enrollment, targetId) ?? true;
  }

  getType(): string {
    return "ModuleAccess";
  }
}

// Handler for checking if the course is completed
export class CourseCompletionHandler extends ProgressHandler {
  constructor(private courseModules: ModuleEntity[]) {
    super();
  }

  canAccess(enrollment: EnrollmentEntity, targetId: string): boolean {
    // Check if all modules are completed
    const allModulesCompleted = this.courseModules.every((module) =>
      enrollment.finishedModulesIds.includes(module.id)
    );

    if (!allModulesCompleted) {
      return false;
    }

    return this.nextHandler?.canAccess(enrollment, targetId) ?? true;
  }

  getType(): string {
    return "CourseCompletion";
  }
}

// Progress Chain Builder
export class ProgressChainBuilder {
  private handlers: ProgressHandler[] = [];

  addClassHandler(
    courseModules: ModuleEntity[],
    classId: string
  ): ProgressChainBuilder {
    this.handlers.push(new ClassAccessHandler(courseModules, classId));
    return this;
  }

  addModuleHandler(
    courseModules: ModuleEntity[],
    moduleId: string
  ): ProgressChainBuilder {
    this.handlers.push(new ModuleAccessHandler(courseModules, moduleId));
    return this;
  }

  addCourseCompletionHandler(
    courseModules: ModuleEntity[]
  ): ProgressChainBuilder {
    this.handlers.push(new CourseCompletionHandler(courseModules));
    return this;
  }

  build(): ProgressHandler | null {
    if (this.handlers.length === 0) {
      return null;
    }

    // Chain the handlers together
    for (let i = 0; i < this.handlers.length - 1; i++) {
      this.handlers[i].setNext(this.handlers[i + 1]);
    }

    return this.handlers[0];
  }
}

// Progress Service that uses the Chain of Responsibility
export class ProgressService {
  constructor(private courseModules: ModuleEntity[]) {}

  canAccessClass(enrollment: EnrollmentEntity, classId: string): boolean {
    const chain = new ProgressChainBuilder()
      .addClassHandler(this.courseModules, classId)
      .build();

    return chain?.canAccess(enrollment, classId) ?? true;
  }

  canAccessModule(enrollment: EnrollmentEntity, moduleId: string): boolean {
    const chain = new ProgressChainBuilder()
      .addModuleHandler(this.courseModules, moduleId)
      .build();

    return chain?.canAccess(enrollment, moduleId) ?? true;
  }

  getNextAvailableClass(enrollment: EnrollmentEntity): string | null {
    for (const courseModule of this.courseModules) {
      for (const classItem of courseModule.classes) {
        if (!enrollment.finishedClassesIds.includes(classItem.id)) {
          if (this.canAccessClass(enrollment, classItem.id)) {
            return classItem.id;
          }
        }
      }
    }
    return null;
  }

  getNextAvailableModule(enrollment: EnrollmentEntity): string | null {
    for (const courseModule of this.courseModules) {
      if (!enrollment.finishedModulesIds.includes(courseModule.id)) {
        if (this.canAccessModule(enrollment, courseModule.id)) {
          return courseModule.id;
        }
      }
    }
    return null;
  }

  getProgressInfo(enrollment: EnrollmentEntity): {
    totalClasses: number;
    completedClasses: number;
    totalModules: number;
    completedModules: number;
    nextAvailableClass: string | null;
    nextAvailableModule: string | null;
  } {
    const totalClasses = this.courseModules.reduce(
      (total, module) => total + module.classes.length,
      0
    );
    const totalModules = this.courseModules.length;

    return {
      totalClasses,
      completedClasses: enrollment.finishedClassesIds.length,
      totalModules,
      completedModules: enrollment.finishedModulesIds.length,
      nextAvailableClass: this.getNextAvailableClass(enrollment),
      nextAvailableModule: this.getNextAvailableModule(enrollment),
    };
  }
}

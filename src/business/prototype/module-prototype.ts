// src/core/prototypes/module-prototype.ts
import { ModuleEntity } from "@/entities/module-entity";
import { ClassType as PrismaClassType } from "@prisma/client";
import { ClassType as DtoClassType } from "@/business/dto/module/module-dto";
import { v4 as uuidv4 } from "uuid";

/**
 * Interface que define o contrato para objetos que podem ser clonados
 */
export interface Cloneable<T> {
  clone(): T;
}

/**
 * Implementação concreta do Prototype para ModuleEntity
 */
export class ModulePrototype implements Cloneable<ModulePrototype> {
  private module: ModuleEntity;

  constructor(module: ModuleEntity) {
    this.module = module;
  }

  /**
   * Converte o ClassType do Prisma para o ClassType do DTO
   */
  private convertClassType(type: PrismaClassType): DtoClassType {
    switch (type) {
      case "video":
        return DtoClassType.VIDEO;
      case "text":
        return DtoClassType.TEXT;
      case "quiz":
        return DtoClassType.QUIZ;
      default:
        throw new Error(`Tipo de classe desconhecido: ${type}`);
    }
  }

  /**
   * Método clone que cria uma cópia profunda do módulo
   * @param newName Nome opcional para a cópia
   * @returns Nova instância de ModulePrototype com os dados clonados
   */
  public clone(newName?: string): ModulePrototype {
    // Cria cópia profunda das classes com conversão de tipos
    const clonedClasses = this.module.classes.map((cls) => ({
      ...cls,
      id: uuidv4(), // Novo ID para cada classe
      type: this.convertClassType(cls.type), // Conversão do tipo
      createdAt: new Date(),
      updatedAt: new Date(),
      // Mantém o quizId original se existir
      quizId: cls.quizId || null,
    }));

    // Cria novo módulo com os dados clonados
    const clonedModule: ModuleEntity = {
      ...this.module,
      id: uuidv4(), // Novo ID para o módulo
      name: newName || `${this.module.name} (Cópia)`,
      classes: clonedClasses,
      createdAt: new Date(),
      updatedAt: new Date(),
      coursesIds: this.module.coursesIds || [], // Garante que courseIds existe
    };

    return new ModulePrototype(clonedModule);
  }

  /**
   * Retorna a entidade do módulo clonado
   */
  public getClonedModule(): ModuleEntity {
    return this.module;
  }
}

/**
 * Factory para criação de prototypes
 */
export class ModulePrototypeFactory {
  /**
   * Cria um prototype a partir de uma ModuleEntity existente
   * @param module Módulo a ser clonado
   * @returns Instância de ModulePrototype
   */
  public static create(module: ModuleEntity): ModulePrototype {
    return new ModulePrototype(module);
  }
}

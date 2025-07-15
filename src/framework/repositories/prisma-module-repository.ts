import { prisma } from "@/framework/database/prisma";

import { IModuleRepository } from "@/business/repositories/module-repository";
import { ModuleEntity } from "@/entities/module-entity";
import {
  InputCreateModuleDto,
  InputDeleteModuleDto,
  InputGetModuleDto,
  InputUpdateModuleDto,
} from "@/business/dto/module/module-dto";
import { v4 as uuidv4 } from "uuid";
import { isValidObjectId } from "@/shared/isObjectId";

export class PrismaModuleRepository implements IModuleRepository {
  async list(): Promise<ModuleEntity[]> {
    return await prisma.module.findMany();
  }

  async create(input: InputCreateModuleDto): Promise<ModuleEntity> {
    const data = await prisma.module.create({
      data: {
        ...input,
        classes: input.classes
          ? input.classes.map((value) => {
              return {
                ...value,
                id: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date(),
              };
            })
          : [],
      },
    });

    return data;
  }

  async update(input: InputUpdateModuleDto): Promise<ModuleEntity> {
    const moduleData = await this.get({ moduleId: input.moduleId });
    let latestClasses = moduleData?.classes || [];

    // 1. Remove classes marcadas para exclusão
    if (input.deletedClasses && input.deletedClasses.length > 0) {
      latestClasses = latestClasses.filter(
        (c) => !input.deletedClasses?.includes(c.id)
      );
    }

    // 2. Processa atualizações/criações
    const updatedClasses = input.classes
      ? input.classes.map((newClass) => {
          // Atualiza classe existente
          if (newClass.id) {
            const existingClass = latestClasses.find(
              (c) => c.id === newClass.id
            );
            if (existingClass) {
              return {
                ...existingClass,
                ...newClass,
                updatedAt: new Date(),
              };
            }
          }

          // Cria nova classe
          return {
            ...newClass,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        })
      : undefined;

    // 3. Persiste no banco
    const data = await prisma.module.update({
      where: { id: input.moduleId },
      data: {
        name: input.name,
        classes: updatedClasses
          ? [
              ...latestClasses.filter(
                (c) => !input.classes?.some((nc) => nc.id === c.id)
              ),
              ...updatedClasses,
            ]
          : latestClasses,
      },
    });

    return data;
  }

  async get(input: InputGetModuleDto): Promise<ModuleEntity | null> {
    if (!isValidObjectId(input.moduleId)) return null;

    const data = await prisma.module.findFirst({
      where: { id: input.moduleId },
    });

    return data;
  }

  async delete(input: InputDeleteModuleDto): Promise<void> {
    await prisma.module.delete({
      where: { id: input.moduleId },
    });
  }
}

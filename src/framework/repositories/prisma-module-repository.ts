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
        classes: input.classes.map((value) => {
          return {
            ...value,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
      },
    });

    return data;
  }

  async update(input: InputUpdateModuleDto): Promise<ModuleEntity> {
    const data = await prisma.module.update({
      where: { id: input.moduleId },
      data: {
        name: input.name,
        classes: input.classes
          ? input.classes.map((value) => {
              return {
                ...value,
                id: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date(),
              };
            })
          : undefined,
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

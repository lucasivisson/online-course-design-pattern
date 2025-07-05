import {
  InputCreateModuleDto,
  InputUpdateModuleDto,
  InputDeleteModuleDto,
  InputGetModuleDto,
} from "@/business/dto/module/module-dto";
import { ModuleEntity } from "@/entities/module-entity";

export interface IModuleRepository {
  create(input: InputCreateModuleDto): Promise<ModuleEntity>;
  list(): Promise<ModuleEntity[]>;
  get(input: InputGetModuleDto): Promise<ModuleEntity | null>;
  update(input: InputUpdateModuleDto): Promise<ModuleEntity>;
  delete(input: InputDeleteModuleDto): Promise<void>;
}

import { api } from "@/config/api";
import { ModuleEntity } from "@/entities/module-entity";

export class ModuleService {
  static async getModules(): Promise<ModuleEntity[]> {
    try {
      const response = await api.get<{ module: ModuleEntity[] }>("/api/module");
      return response.module;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw new Error("Failed to fetch modules");
    }
  }

  static async getCourseById(id: string): Promise<ModuleEntity> {
    try {
      const response = await api.get<ModuleEntity>(`/api/course/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching module:", error);
      throw new Error("Failed to fetch module");
    }
  }
}

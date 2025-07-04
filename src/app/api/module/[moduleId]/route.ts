import { ModuleController } from "@/controllers/module-controller";
import { NextRequest } from "next/server";

const controller = new ModuleController();

type Params = {
  params: {
    moduleId: string;
  };
};

export const GET = (_: NextRequest, { params }: Params) =>
  controller.get({ moduleId: params.moduleId });
export const DELETE = (_: NextRequest, { params }: Params) =>
  controller.delete({ moduleId: params.moduleId });
export const PUT = (req: NextRequest, { params }: Params) =>
  controller.update(req, params.moduleId);

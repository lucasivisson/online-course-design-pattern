import { ModuleController } from "@/controllers/module-controller";
import { NextRequest } from "next/server";

const controller = new ModuleController();

type Params = {
  params: Promise<{
    moduleId: string;
  }>;
};

export const GET = async (_: NextRequest, { params }: Params) => {
  const { moduleId } = await params;
  return controller.get({ moduleId });
};
export const DELETE = async (_: NextRequest, { params }: Params) => {
  const { moduleId } = await params;
  return controller.delete({ moduleId });
};
export const PUT = async (req: NextRequest, { params }: Params) => {
  const { moduleId } = await params;
  return controller.update(req, moduleId);
};

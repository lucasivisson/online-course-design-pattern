// app/api/modules/[moduleId]/duplicate/route.ts
import { ModuleController } from "@/controllers/module-controller";
import { NextRequest } from "next/server";

const controller = new ModuleController();

type Params = {
  params: Promise<{
    moduleId: string;
  }>;
};

export const POST = async (req: NextRequest, { params }: Params) => {
  const { moduleId } = await params;
  return controller.duplicate(req, moduleId);
};

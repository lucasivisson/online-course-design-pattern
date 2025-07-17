import { Button } from "@/components/ui/button";
import UsersIcon from "@/assets/users.svg";
import CalendarIcon from "@/assets/calendar.svg";
import BookIcon from "@/assets/book.svg";

interface ManageCourseCardProps {
  title: string;
  status: string;
  students: number;
  modules: number;
  lastUpdate: string;
  manageLink: string;
}

export function ManageCourseCard({
  title,
  status,
  students,
  modules,
  lastUpdate,
  manageLink,
}: ManageCourseCardProps) {
  return (
    <div className="p-6 flex flex-col min-w-96 w-full justify-between  bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col gap-2 mb-3">
        <span className="text-lg font-semibold text-black">{title}</span>
        <div className="bg-green-100 py-0.5 px-3 w-fit rounded-lg">
          <span className="font-bold text-xs text-green-700">{status}</span>
        </div>
      </div>
      <div className="space-y-3 text-sm text-gray-500">
        <div className="flex gap-1 items-center">
          <UsersIcon className="size-3" />
          <span>{students} alunos inscritos</span>
        </div>
        <div className="flex gap-1 items-center">
          <BookIcon className="size-3" />
          <span>{modules} módulos</span>
        </div>
        <div className="flex gap-1  items-center">
          <CalendarIcon className="size-3" />
          <span>Atualizado em {lastUpdate}</span>
        </div>
      </div>
      <Button variant="gray-50" className="text-center mt-6" href={manageLink}>
        Gerenciar Curso
      </Button>
    </div>
  );
}

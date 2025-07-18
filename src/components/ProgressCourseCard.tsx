import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { cn } from "@/shared/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProgressCourseCardProps {
  enrollment: EnrollmentEntity;
  onClick?: () => void;
  index: number;
}

export function ProgressCourseCard({
  index,
  enrollment,
  onClick,
}: ProgressCourseCardProps) {
  const { course, finishedModulesIds } = enrollment;

  const progressRate =
    course.modulesIds.length > 0
      ? Number(
          (
            (finishedModulesIds.length / course.modulesIds.length) *
            100
          ).toFixed(0)
        )
      : 0;

  const getRandomBackgroundColorBasedOnIndex = (index: number) => {
    const colors = [
      "bg-yellow-500/20",
      "bg-green-500/20",
      "bg-pink-500/20",
      "bg-blue-500/20",
      "bg-indigo-500/20",
      "bg-red-500/20",
      "bg-orange-500/20",
    ];
    return colors[index % colors.length];
  };

  return (
    <Button variant="link" href={`/curso/${course.id}`}>
      <div
        className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
        onClick={onClick}
      >
        <div
          className={cn(
            getRandomBackgroundColorBasedOnIndex(index),
            "w-full relative flex items-center justify-center h-40"
          )}
        >
          <div className="absolute flex text-sm gap-0.5 font-semibold top-3 right-3 text-black/70 px-2 py-0.5 bg-white rounded-lg">
            <Image src="/clock.svg" alt="Clock icon" width={16} height={16} />
            <span>{progressRate}%</span>
          </div>
          <Image
            aria-hidden
            src="/book.svg"
            alt="Book icon"
            width={48}
            height={48}
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {course.name}
            </h3>
          </div>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            Prof. {course.professor?.name}
          </p>

          <p className="text-gray-500 h-16 font-normal text-sm line-clamp-3 mb-4">
            {course.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-800">
            <div className="flex flex-col w-full">
              <div className="flex items-center w-full  justify-between mb-1">
                <span className="font-semibold">Progresso</span>
                <span className="font-semibold">{progressRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-black rounded-full transition-all"
                  style={{ width: `${progressRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4">
            {progressRate === 100 ? (
              <span className="px-2 py-0.5 text-sm bg-green-100 text-green-800 rounded-lg">
                Concluído
              </span>
            ) : progressRate > 0 ? (
              <span className="px-2 py-0.5 text-sm bg-blue-100 text-blue-950 rounded-lg">
                Em andamento
              </span>
            ) : (
              <span className="px-2 py-0.5 text-sm bg-gray-100 text-gray-950 rounded-lg">
                Não iniciado
              </span>
            )}
          </div>
        </div>
      </div>
    </Button>
  );
}

import { CourseEntity } from "@/entities/course-entity";
import { cn } from "@/shared/utils";
import { Button } from "@/components/ui/button";
import BookIcon from "@/assets/book.svg";
import StarIcon from "@/assets/star.svg";
import UsersIcon from "@/assets/users.svg";

interface CourseCardProps {
  course: CourseEntity;
  onClick?: () => void;
  index: number;
}

export function CourseCard({ index, course, onClick }: CourseCardProps) {
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
    <div className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200">
      <div
        className={cn(
          getRandomBackgroundColorBasedOnIndex(index),
          "w-full relative flex items-center justify-center h-40"
        )}
      >
        <div className="absolute text-sm top-3 left-3 text-black/70 px-2 py-0.5 bg-white rounded-lg">
          Programação
        </div>
        <BookIcon className="w-12 h-12 text-gray-800" />
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

        <p className="text-gray-800 text-sm line-clamp-3 mb-4">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-800">
          <div className="flex gap-1 items-center">
            <StarIcon className="w-3 h-3" />
            <span>4.8</span>
          </div>
          <div className="flex gap-1  items-center">
            <UsersIcon className="w-3 h-3" />
            <span>
              {course.enrollments?.length || 0}{" "}
              {`${course.enrollments?.length === 1 ? "aluno" : "alunos"}`}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="max-xl:flex-col flex items-center justify-between text-xs text-gray-400">
            <span>
              <span className="text-xl font-bold text-green-600">
                R$ {course.price.toFixed(2)}
              </span>
            </span>
            <Button onClick={onClick} variant="blue" className="max-xl:w-full">
              Inscrever-se
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

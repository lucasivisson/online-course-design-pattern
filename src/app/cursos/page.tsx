import { CourseEntity } from "@/entities/course-entity";
import { CourseCard } from "@/components/CourseCard";
import { CourseService } from "@/services/course-service";
import { Button } from "@/components/ui/button";
import { Stats } from "@/components/ui/stats";
import Image from "next/image";

export default async function CoursesPage() {
  const courses: CourseEntity[] = await CourseService.getCourses();

  if (!courses) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-600">
              Algo deu errado ao carregar os cursos. Tente novamente mais tarde.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Catálogo de Cursos
            </h1>
            <p className="text-gray-600">
              Descubra novos conhecimentos e expanda suas habilidades
            </p>
          </div>
          <Button
            variant="gray-50"
            className="flex border-0 items-center gap-2"
          >
            <Image src="/arrow.svg" alt="Voltar" width={16} height={16} />
            <span>Voltar para Meus Cursos</span>
          </Button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum curso disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard index={index} key={index} course={course} />
            ))}
          </div>
        )}

        <Stats
          className="mt-10"
          items={[
            { value: "50+", label: "Cursos Disponíveis", color: "blue" },
            { value: "15k+", label: "Alunos Ativos", color: "green" },
            { value: "4.8+", label: "Avaliação Média", color: "purple" },
          ]}
        />
      </div>
    </div>
  );
}

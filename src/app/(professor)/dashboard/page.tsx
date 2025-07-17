"use client";

import { CourseEntity } from "@/entities/course-entity";
import { CourseService } from "@/services/course-service";
import { StatCard } from "@/components/StatCard";
import BookIcon from "@/assets/book.svg";
import UsersIcon from "@/assets/users.svg";
import ChartIcon from "@/assets/chart.svg";
import { ManageCourseCard } from "@/components/ManageCourseCard";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [courses, setCourses] = useState<CourseEntity[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCourses = await CourseService.getCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        setError("Erro ao carregar os cursos. Tente novamente mais tarde.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600">Carregando cursos...</div>
          </div>
        </div>
      </div>
    );
  }

  if (courses?.length === 0)
    <div className="text-gray-500">Nenhum curso encontrado.</div>;

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const studentsIds =
    courses
      ?.map((course) =>
        course.enrollments?.map((enrollment) => enrollment.studentId)
      )
      ?.flat() || [];

  const totalStudents = [...new Set(studentsIds)];

  return (
    <div className="bg-gray-50">
      <div className="container overflow-hidden mx-auto py-8">
        <div className="flex flex-wrap w-full gap-3 sm:flex-row flex-col">
          <StatCard
            index={0}
            title="Total de Cursos"
            value={courses?.length.toString() || "0"}
            icon={<BookIcon className="size-6" />}
          />
          <StatCard
            index={1}
            title="Total de Alunos"
            value={totalStudents.length.toString()}
            icon={<UsersIcon className="size-6" />}
          />
          <StatCard
            index={2}
            title="Cursos Publicados"
            value={courses?.length.toString() || "0"}
            icon={<ChartIcon className="size-6" />}
          />
        </div>
        <div className="flex gap-3 my-6 text-black">
          <h1 className="text-2xl font-bold">Meus Cursos</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {courses?.map((course) => (
            <ManageCourseCard
              key={course.id}
              title={course.name}
              modules={course.modules?.length || 0}
              status="Publicado"
              students={course.enrollments?.length || 0}
              lastUpdate={
                course.updatedAt
                  ? new Date(course.updatedAt).toLocaleDateString("pt-BR")
                  : "Nunca"
              }
              manageLink={`/curso/${course.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

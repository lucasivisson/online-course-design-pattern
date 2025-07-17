"use client";

import { CourseService } from "@/services/course-service";
import { Button } from "@/components/ui/button";
import { ProgressCourseCard } from "@/components/ProgressCourseCard";
import BookIcon from "@/assets/book.svg";
import { EnrollmentEntity } from "@/entities/enrollment-entity";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function CoursesPage() {
  const { userId } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentEntity[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      return redirect("/login");
    }

    const fetchEnrollments = async () => {
      try {
        const data = await CourseService.getUserCourses(userId);
        setEnrollments(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId]);

  if (!userId) {
    return redirect("/login");
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </div>
    );
  }

  if (!enrollments?.length) {
    return (
      <div className="h-screen bg-white">
        <div className="container h-full mx-auto px-4 py-8">
          <div className="flex flex-col h-full gap-6 items-center justify-center min-h-[400px]">
            <div className="text-red-600">
              Você não possui nenhum curso. Explore nossos cursos disponíveis
              clicando no botão abaixo.
            </div>
            <Button
              href="/cursos"
              variant="blue"
              className="flex border-0 items-center gap-2"
            >
              <BookIcon className="w-5 h-5 text-white" />
              <span>Explorar Novos Cursos</span>
            </Button>
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
            href="/cursos"
            variant="blue"
            className="flex border-0 items-center gap-2"
          >
            <BookIcon className="w-5 h-5 text-white" />
            <span>Explorar Novos Cursos</span>
          </Button>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum curso disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => (
              <ProgressCourseCard
                index={index}
                key={index}
                enrollment={enrollment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

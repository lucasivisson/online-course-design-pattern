"use client";
import { api } from "@/config/api";
import { ModuleEntity } from "@/entities/module-entity";
import { Class } from "@prisma/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

interface Quiz {
  id: string;
  title: string;
}

export default function UpdateClassPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const moduleId = params.moduleId as string;
  const classId = searchParams.get("aulaId") as string;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Class | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    textContent: "",
    videoUrl: "",
    quizId: "",
  });

  const categories = [
    { label: "Texto", value: "text" },
    { label: "Vídeo", value: "video" },
    { label: "Quiz", value: "quiz" },
  ];

  const fetchClassData = useCallback(async () => {
    try {
      const response = await api.get<{ module: ModuleEntity }>(
        `/api/module/${moduleId}`
      );
      const classFind = response.module.classes.find((c) => c.id === classId);
      setInitialData(classFind || null);
      setFormData({
        name: classFind?.name || "",
        textContent: classFind?.textContent || "",
        videoUrl: classFind?.videoUrl || "",
        quizId: classFind?.quizId || "",
      });
    } catch (error) {
      toast.error("Erro ao carregar dados da aula");
      console.error("Failed to fetch class:", error);
      router.back();
    }
  }, [classId, moduleId, router]);
  // Busca os dados da aula
  useEffect(() => {
    if (!classId) {
      toast.error("ID da aula não encontrado");
      router.back();
      return;
    }

    fetchClassData();
  }, [classId, fetchClassData, router]);

  // Busca os quizzes disponíveis se for do tipo quiz
  useEffect(() => {
    if (initialData?.type === "quiz") {
      fetchQuizzes();
    }
  }, [initialData]);

  const fetchQuizzes = async () => {
    setIsLoadingQuizzes(true);
    try {
      const response = await api.get<Quiz[]>("/api/quiz");
      setQuizzes(response);
    } catch (error) {
      toast.error("Erro ao carregar quizzes");
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Monta o objeto da classe com os dados atualizados
      const updatedClass = {
        ...initialData,
        name: formData.name,
        ...(initialData?.type === "text" && {
          textContent: formData.textContent,
        }),
        ...(initialData?.type === "video" && { videoUrl: formData.videoUrl }),
        ...(initialData?.type === "quiz" && { quizId: formData.quizId }),
      };

      // Faz o PATCH para atualizar a aula
      await api.patch(`/api/module/${moduleId}`, { classes: [updatedClass] });

      toast.success("Aula atualizada com sucesso!");
      router.back();
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao atualizar aula:", err);
      toast.error(err.message || "Erro ao atualizar aula");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!initialData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="bg-[#DCFCE7] p-4 rounded-full">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.6665 4H10.6665C12.081 4 13.4375 4.5619 14.4377 5.5621C15.4379 6.56229 15.9998 7.91885 15.9998 9.33333V28C15.9998 26.9391 15.5784 25.9217 14.8283 25.1716C14.0781 24.4214 13.0607 24 11.9998 24H2.6665V4Z"
              stroke="#16A34A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29.3333 4H21.3333C19.9188 4 18.5623 4.5619 17.5621 5.5621C16.5619 6.56229 16 7.91885 16 9.33333V28C16 26.9391 16.4214 25.9217 17.1716 25.1716C17.9217 24.4214 18.9391 24 20 24H29.3333V4Z"
              stroke="#16A34A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Aula</h1>
        <p className="text-gray-700">Atualize as informações da sua aula.</p>
      </div>

      <div className="bg-white shadow border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Informações da Aula
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="class-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome da Aula <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="class-name"
              name="name"
              className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Ex: Introdução ao React, Fundamentos de Node.js..."
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Aula <span className="text-red-500">*</span>
            </label>
            <div className="relative text-gray-500">
              <button
                type="button"
                className="w-full text-left bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled
              >
                <span className="block truncate">
                  {categories.find((c) => c.value === initialData.type)?.label}
                </span>
              </button>
            </div>
          </div>

          {initialData.type === "text" && (
            <div>
              <label
                htmlFor="textContent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Conteúdo do Texto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="textContent"
                name="textContent"
                className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                placeholder="Ex: PDF transcrição, links externos..."
                value={formData.textContent}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {initialData.type === "video" && (
            <div>
              <label
                htmlFor="videoUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL do Vídeo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="videoUrl"
                name="videoUrl"
                className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                placeholder="Ex: https://youtube.com/embed/..."
                value={formData.videoUrl}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {initialData.type === "quiz" && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecione um Quiz <span className="text-red-500">*</span>
              </label>
              <div className="relative text-gray-500">
                <select
                  name="quizId"
                  value={formData.quizId}
                  onChange={(e) =>
                    setFormData({ ...formData, quizId: e.target.value })
                  }
                  className="w-full text-left bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isLoadingQuizzes}
                >
                  <option value="">
                    {isLoadingQuizzes
                      ? "Carregando quizzes..."
                      : "Selecione um quiz"}
                  </option>
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting
                  ? "opacity-75 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Atualizando..." : "Atualizar Aula"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

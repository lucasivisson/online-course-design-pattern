"use client";
import { api } from "@/config/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";

interface Quiz {
  id: string;
  title: string;
}

export default function CreateClassPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Selecione um tipo de aula"
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    textContent: "",
    videoUrl: "",
    quizId: "",
  });

  // Busca os quizzes disponíveis
  useEffect(() => {
    if (selectedCategory === "Quiz") {
      fetchQuizzes();
    }
  }, [selectedCategory]);

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

  const categories = [
    { label: "Texto", value: "text" },
    { label: "Vídeo", value: "video" },
    { label: "Quiz", value: "quiz" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Monta o objeto da classe conforme o tipo selecionado
      let classData;
      switch (selectedCategory) {
        case "text":
          classData = {
            type: "text",
            name: formData.name,
            textContent: formData.textContent,
          };
          break;
        case "video":
          classData = {
            type: "video",
            name: formData.name,
            videoUrl: formData.videoUrl,
          };
          break;
        case "quiz":
          classData = {
            type: "quiz",
            name: formData.name,
            quizId: formData.quizId,
          };
          break;
        default:
          throw new Error("Tipo de aula inválido");
      }

      // Faz o PATCH para adicionar a classe ao módulo
      await api.patch(`/api/module/${moduleId}`, {
        classes: [classData], // Envia como array conforme esperado pelo backend
      });

      toast.success("Aula criada com sucesso!");
      router.back();
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao criar aula:", err);
      toast.error(err.message || "Erro ao criar aula");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Criar Nova Aula</h1>
        <p className="text-gray-700">
          Preencha as informações básicas da sua aula.
        </p>
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
              >
                <span className="block truncate">
                  {categories.find((c) => c.value === selectedCategory)
                    ?.label || "Selecione um tipo de aula"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>

              {isDropdownOpen && (
                <ul className="text-gray-500 absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                  {categories.map((category) => (
                    <li
                      key={category.value}
                      className="px-3 py-1.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center"
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {category.label}
                      {selectedCategory === category.value && (
                        <span className="ml-auto">
                          <svg
                            className="h-4 w-4 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {selectedCategory === "text" && (
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

          {selectedCategory === "video" && (
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

          {selectedCategory === "quiz" && (
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

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting
                  ? "opacity-75 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Criando..." : "Criar Aula"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

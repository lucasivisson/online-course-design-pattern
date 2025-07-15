"use client";
import Image from "next/image";
import { useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Adicionei o router para redirecionar após sucesso
import { api } from "@/config/api";
import { TEACHER_ID } from "@/shared/constants";

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatToCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.padStart(3, "0");

    const real = value.slice(0, -2);
    const cents = value.slice(-2);

    let formattedValue = "";
    if (real) {
      formattedValue = `${Number(real).toLocaleString("pt-BR")},${cents}`;
    } else {
      formattedValue = `0,${cents}`;
    }

    setFormData((prev) => ({ ...prev, price: formattedValue }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const convertPriceToNumber = (priceString: string): number => {
    const numericString = priceString.replace(/\./g, "").replace(",", ".");
    return parseFloat(numericString) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const professorId = TEACHER_ID; // Substitua conforme sua lógica de autenticação

      const payload = {
        name: formData.name,
        description: formData.description,
        professorId,
        price: convertPriceToNumber(formData.price),
      };

      const creatingPromise = api.post("/api/course", payload);

      toast.promise(creatingPromise, {
        loading: "Criando curso...",
        success: () => {
          setTimeout(() => router.push("/dashboard/courses"), 1000); // substituir pelo caminho correto
          return "Curso criado com sucesso!";
        },
        error: (err) => {
          console.error("Erro ao criar curso:", err);
          return err.message || "Ocorreu um erro ao criar o curso";
        },
      });
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      toast.error("Ocorreu um erro ao criar o curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="bg-[#dbeafe] p-4 rounded-full">
          <Image
            aria-hidden
            src="/book-blue.svg"
            alt="Book icon"
            width={48}
            height={48}
            className="text-blue-600"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Criar Novo Curso</h1>
        <p className="text-gray-700">
          Preencha as informações básicas do seu curso. Você poderá adicionar
          módulos, aulas e conteúdo após a criação.
        </p>
      </div>

      <div className="bg-white shadow border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Informações do Curso
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="course-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Curso <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="course-name"
              name="name"
              className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Ex: Padrões de Software, React Avançado, Node.js..."
              value={formData.name}
              onChange={handleChange}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Escolha um nome claro e descritivo para o seu curso
            </p>
          </div>

          <div>
            <label
              htmlFor="course-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição do Curso <span className="text-red-500">*</span>
            </label>
            <textarea
              id="course-description"
              name="description"
              rows={4}
              className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Descreva o que os alunos aprenderão neste curso, os pré-requisitos necessários e os objetivos principais..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <p className="mt-2 text-sm text-gray-500">
              Uma boa descrição ajuda os alunos a entenderem o valor do seu
              curso
            </p>
          </div>

          <div>
            <label
              htmlFor="course-price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço do Curso <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="text"
                id="course-price"
                name="price"
                className="placeholder:text-gray-500 text-gray-500 block w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0,00"
                value={formData.price}
                onChange={formatToCurrency}
                required
              />
            </div>
          </div>

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
              {isSubmitting ? "Criando..." : "Criar Curso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

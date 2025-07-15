"use client";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/config/api";
import { ModuleEntity } from "@/entities/module-entity";

export default function CreateModulePage() {
  const router = useRouter();
  const params = useParams();
  const [moduleName, setModuleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!moduleName.trim()) {
      toast.error("Por favor, insira um nome para o módulo", {
        duration: 4000,
      });
      return;
    }

    if (!params.courseId) {
      toast.error("ID do curso não encontrado", { duration: 4000 });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Criando módulo...");

    try {
      const payload = {
        name: moduleName,
        coursesIds: [params.courseId], // Envia como array conforme o DTO
      };

      const data = await api.post<ModuleEntity>("/api/module", payload);
      await api.patch(`/api/course/${params.courseId}`, {
        modulesIds: [data.id],
      });
      toast.success("Módulo criado com sucesso!", {
        id: toastId,
        duration: 4000,
      });
      // Redireciona para a página do curso ou outra rota apropriada
      router.push(`/curso/${params.courseId}`);
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao criar módulo:", err);
      toast.error(err.message || "Ocorreu um erro ao criar o módulo", {
        id: toastId,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!params.courseId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <h1 className="text-3xl font-bold text-gray-900">Carregando...</h1>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Criar Novo Módulo</h1>
        <p className="text-gray-700">
          Preencha as informações básicas do seu módulo. Você poderá adicionar
          aulas e conteúdo após a criação.
        </p>
      </div>

      <div className="bg-white shadow border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Informações do Módulo
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="module-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Módulo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="module-name"
              className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Ex: Introdução aos Padrões, Streams em Node.js, Introdução a API..."
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Escolha um nome claro e descritivo para o seu módulo
            </p>
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
              {isSubmitting ? "Criando..." : "Criar Módulo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

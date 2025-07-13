"use client";

import Image from "next/image";

export default function CreateModulePage() {
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

        <form className="space-y-6">
          <div>
            <label
              htmlFor="course-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Módulo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="course-name"
              className="placeholder:text-gray-500 text-gray-500  mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Ex: Introdução aos Padrões, Streams em Node.js, Introdução a API..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Escolha um nome claro e descritivo para o seu módulo
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Criar Módulo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

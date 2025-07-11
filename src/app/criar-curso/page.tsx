"use client";
import Image from "next/image";
import { useState } from "react";

export default function CreateCoursePage() {
  const [price, setPrice] = useState("");

  const formatToCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não é dígito
    let value = e.target.value.replace(/\D/g, "");

    // Adiciona zeros à esquerda se necessário
    value = value.padStart(3, "0");

    // Formata como centavos
    const real = value.slice(0, -2);
    const cents = value.slice(-2);

    // Monta o valor formatado
    let formattedValue = "";
    if (real) {
      formattedValue = `${Number(real).toLocaleString("pt-BR")},${cents}`;
    } else {
      formattedValue = `0,${cents}`;
    }

    setPrice(formattedValue);
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

        <form className="space-y-6">
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
              className="placeholder:text-gray-500 text-gray-500  mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Ex: Padrões de Software, React Avançado, Node.js..."
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
              rows={4}
              className="placeholder:text-gray-500 text-gray-500  mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Descreva o que os alunos aprenderão neste curso, os pré-requisitos necessários e os objetivos principais..."
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
                type="text" // Mudei para text para melhor controle
                id="course-price"
                className="placeholder:text-gray-500 text-gray-500 block w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0,00"
                value={price}
                onChange={formatToCurrency}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Criar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

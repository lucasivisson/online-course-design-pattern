"use client";

import { useState } from "react";

export default function CreateClassPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Selecione um tipo de aula"
  );

  const [isDropdownQuizOpen, setIsDropdownQuizOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState("Selecione um quiz");

  const categories = ["Texto", "Vídeo", "Quiz"];

  const quizzes = ["Quiz 1", "Quiz 2", "Quiz 3"];

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

        <form className="space-y-6">
          <div>
            <label
              htmlFor="course-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Aula <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="course-name"
              className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Ex: Padrões de Software, React Avançado, Node.js..."
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
                <span className="block truncate">{selectedCategory}</span>
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
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="px-3 py-1.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {category}
                      {selectedCategory === category && (
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

          {selectedCategory === "Texto" && (
            <div>
              <label
                htmlFor="course-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Conteúdo do Texto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="course-name"
                className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                placeholder="Ex: PDF transcrição, links externos..."
              />
            </div>
          )}

          {selectedCategory === "Texto" && (
            <div>
              <label
                htmlFor="course-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vídeo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="course-name"
                className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                placeholder="Ex: Link do vídeo, descrição..."
              />
            </div>
          )}

          {selectedCategory === "Quiz" && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Aula <span className="text-red-500">*</span>
              </label>
              <div className="relative text-gray-500">
                <button
                  type="button"
                  className="w-full text-left bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setIsDropdownQuizOpen(!isDropdownQuizOpen)}
                >
                  <span className="block truncate">{selectedQuiz}</span>
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

                {isDropdownQuizOpen && (
                  <ul className="text-gray-500 absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                    {quizzes.map((quiz, index) => (
                      <li
                        key={index}
                        className="px-3 py-1.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center"
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setIsDropdownQuizOpen(false);
                        }}
                      >
                        {quiz}
                        {selectedQuiz === quiz && (
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
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Criar Aula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function CourseManagement() {
  const [modules] = useState([
    {
      id: 1,
      title: "Módulo 1: Introdução aos Padrões",
      lessons: [
        {
          id: 1,
          title: "O que são Padrões de Software",
          duration: "15 min",
          completed: true,
        },
        {
          id: 2,
          title: "História e Evolução",
          duration: "10 min",
          completed: true,
        },
        {
          id: 3,
          title: "Quiz: Conceitos Básicos",
          duration: "",
          completed: true,
        },
      ],
    },
    {
      id: 2,
      title: "Módulo 2: Padrões Criacionais",
      lessons: [
        {
          id: 4,
          title: "Singleton Pattern",
          duration: "20 min",
          completed: true,
        },
        { id: 5, title: "Factory Pattern", duration: "", completed: false },
      ],
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Curso: Padrões de Software
          </h1>
          <div className="flex gap-6 mt-4 text-gray-600">
            <span>45 alunos inscritos</span>
            <span>3 módulos</span>
            <span>9 aulas</span>
          </div>
        </div>
        <div>
          <button className="flex cursor-pointer border border-[#E4E4E7] items-center gap-2 px-4 py-2 text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-900"
            >
              <path
                d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.2499 1.74991C12.5151 1.48469 12.8748 1.33569 13.2499 1.33569C13.625 1.33569 13.9847 1.48469 14.2499 1.74991C14.5151 2.01512 14.6641 2.37483 14.6641 2.74991C14.6641 3.12498 14.5151 3.48469 14.2499 3.74991L7.99992 9.99991L5.33325 10.6666L5.99992 7.99991L12.2499 1.74991Z"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Editar curso</span>
          </button>
        </div>
      </header>
      <div className="mt-2 mb-8">
        <span className="bg-[#DCFCE7] px-2 py-[6px] rounded-2xl text-[#166534] font-semibold text-[12px]">
          Publicado
        </span>
      </div>

      <div className="flex gap-4 mb-8">
        <button className="flex cursor-pointer justify-center items-center gap-2 w-[25%] py-4 px-2 text-white bg-[#2563EB] hover:bg-[#2564ebd8] rounded-md transition-colors duration-200">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 1.33325H4.74996C4.39634 1.33325 4.0572 1.47373 3.80715 1.72378C3.5571 1.97382 3.41663 2.31296 3.41663 2.66659V13.3333C3.41663 13.6869 3.5571 14.026 3.80715 14.2761C4.0572 14.5261 4.39634 14.6666 4.74996 14.6666H12.75C13.1036 14.6666 13.4427 14.5261 13.6928 14.2761C13.9428 14.026 14.0833 13.6869 14.0833 13.3333V4.66659L10.75 1.33325Z"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.0834 1.33325V3.99992C10.0834 4.35354 10.2239 4.69268 10.4739 4.94273C10.7239 5.19278 11.0631 5.33325 11.4167 5.33325H14.0834"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.41671 6H6.08337"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.4167 8.66675H6.08337"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.4167 11.3333H6.08337"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span className="font-medium">Publicar trabalho</span>
        </button>
        <button className="flex cursor-pointer justify-center items-center gap-2 w-[25%] py-4 px-2 text-white bg-[#9333EA] hover:bg-[#9233eabb] rounded-md transition-colors duration-200">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5219 5.23337C13.4892 5.44803 13.5612 5.66537 13.7145 5.8187L14.7599 6.86403C15.0732 7.17737 15.2305 7.5887 15.2305 8.00003C15.2305 8.41137 15.0739 8.82203 14.7599 9.13603L13.6859 10.21C13.6137 10.2821 13.5256 10.3363 13.4287 10.3683C13.3318 10.4002 13.2288 10.4091 13.1279 10.394C12.8145 10.3474 12.5932 10.074 12.4825 9.77737C12.3854 9.51522 12.224 9.2817 12.013 9.09828C11.8021 8.91485 11.5484 8.78742 11.2753 8.72769C11.0022 8.66795 10.7184 8.67785 10.4502 8.75646C10.1819 8.83506 9.9377 8.97986 9.74003 9.17753C9.54236 9.3752 9.39756 9.6194 9.31896 9.88767C9.24035 10.1559 9.23046 10.4397 9.29019 10.7128C9.34992 10.9859 9.47735 11.2396 9.66078 11.4505C9.8442 11.6615 10.0777 11.8229 10.3399 11.92C10.6372 12.0307 10.9099 12.2514 10.9565 12.5654C10.9716 12.6663 10.9628 12.7693 10.9309 12.8662C10.8989 12.9631 10.8447 13.0512 10.7725 13.1234L9.6992 14.1967C9.55013 14.3463 9.37297 14.4649 9.1779 14.5458C8.98284 14.6267 8.77371 14.6682 8.56253 14.668C8.35151 14.6683 8.14251 14.6269 7.94756 14.5461C7.7526 14.4653 7.57553 14.3468 7.42653 14.1974L6.3812 13.152C6.30564 13.0763 6.21339 13.0194 6.11185 12.9858C6.01031 12.9523 5.90232 12.943 5.79653 12.9587C5.46787 13.008 5.23653 13.2947 5.11653 13.604C5.01595 13.8622 4.85259 14.0912 4.64123 14.2704C4.42987 14.4495 4.17718 14.5732 3.90602 14.6301C3.63485 14.687 3.35378 14.6755 3.08821 14.5964C2.82265 14.5174 2.58097 14.3734 2.38505 14.1775C2.18913 13.9816 2.04514 13.7399 1.96612 13.4744C1.8871 13.2088 1.87553 12.9277 1.93246 12.6565C1.98939 12.3854 2.11302 12.1327 2.29218 11.9213C2.47134 11.71 2.70036 11.5466 2.95853 11.446C3.26787 11.326 3.55453 11.0947 3.6032 10.766C3.61901 10.6603 3.60982 10.5523 3.57636 10.4508C3.5429 10.3493 3.4861 10.257 3.41053 10.1814L2.3652 9.13603C2.21576 8.98703 2.09725 8.80996 2.01648 8.61501C1.93571 8.42005 1.89426 8.21106 1.89453 8.00003C1.89453 7.5887 2.05187 7.17737 2.3652 6.86403L3.38253 5.8467C3.54253 5.6867 3.76987 5.61137 3.99387 5.6447C4.3372 5.69603 4.57853 5.9967 4.7092 6.31803C4.813 6.57253 4.97813 6.79741 5.18988 6.97264C5.40163 7.14787 5.65343 7.26801 5.92285 7.32236C6.19227 7.37672 6.47096 7.3636 6.73408 7.28417C6.99721 7.20474 7.23661 7.06147 7.43096 6.86712C7.62531 6.67277 7.76857 6.43337 7.848 6.17025C7.92743 5.90712 7.94055 5.62844 7.8862 5.35902C7.83184 5.08959 7.7117 4.83779 7.53647 4.62604C7.36124 4.41429 7.13636 4.24916 6.88187 4.14537C6.56053 4.0147 6.25987 3.77337 6.20853 3.43003C6.1752 3.20603 6.24987 2.97937 6.41053 2.8187L7.4272 1.80203C7.57618 1.6528 7.75316 1.53446 7.94799 1.4538C8.14282 1.37315 8.35167 1.33176 8.56253 1.33203C8.97387 1.33203 9.3852 1.48937 9.69853 1.8027L10.7439 2.84803C10.8972 3.00137 11.1145 3.07337 11.3285 3.04137C11.6572 2.99203 11.8885 2.70537 12.0085 2.39603C12.1091 2.13786 12.2725 1.90884 12.4838 1.72968C12.6952 1.55052 12.9479 1.42689 13.219 1.36996C13.4902 1.31303 13.7713 1.3246 14.0369 1.40362C14.3024 1.48264 14.5441 1.62663 14.74 1.82255C14.9359 2.01847 15.0799 2.26015 15.1589 2.52571C15.238 2.79128 15.2495 3.07235 15.1926 3.34352C15.1357 3.61468 15.012 3.86737 14.8329 4.07873C14.6537 4.29009 14.4247 4.45345 14.1665 4.55403C13.8572 4.67403 13.5705 4.9047 13.5219 5.23337Z"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span className="font-medium">Criar quiz</span>
        </button>
      </div>
      <hr />
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Estrutura do Curso
          </h2>
          <button className="flex items-center justify-between font-medium cursor-pointer py-3 px-2 w-[200px] bg-[#2563EB] hover:bg-[#2564ebd8] text-white rounded-md">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.84888 8H13.1822"
                stroke="#FAFAFA"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.51562 3.33325V12.6666"
                stroke="#FAFAFA"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Adicionar Módulo</span>
            <div />
          </button>
        </div>
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-lg shadow border mb-6 overflow-hidden"
          >
            <div className="flex justify-between p-6 border-b">
              <h3 className="font-bold text-lg text-gray-900">
                {module.title}
              </h3>
              <button className="flex items-center justify-between font-medium cursor-pointer py-2 px-2 w-[140px] bg-[#16A34A] hover:bg-[#16a34ac4] text-white rounded-md">
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.84888 8H13.1822"
                    stroke="#FAFAFA"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.51562 3.33325V12.6666"
                    stroke="#FAFAFA"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="text-[14px]">Adicionar Aula</span>
                <div></div>
              </button>
            </div>

            <div className="divide-y">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 2L13.3333 8L4 14V2Z"
                            stroke="#2563EB"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>

                        <div className="bg-[#F3F4F6] px-[5px] rounded-md">
                          <span className="text-[#6B7280] text-[12px] font-medium">
                            Vídeo
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col ml-3">
                        <p className="font-normal text-gray-900">
                          {lesson.id}. {lesson.title}
                        </p>
                        {lesson.duration && (
                          <p className="text-sm text-gray-500">
                            {lesson.duration}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={lesson.completed}
                        onChange={() => {}}
                        className="h-5 w-5 text-blue-600 rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

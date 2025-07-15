"use client";

import { api } from "@/config/api";
import { CourseEntity } from "@/entities/course-entity";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "90%",
    borderRadius: "8px",
    border: "none",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

export default function CourseManagement() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<{
    moduleId: string;
    classId: string;
  } | null>(null);

  const fetchCourseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const courseData = await api.get<{ course: CourseEntity }>(
        `/api/course/${courseId}`
      );
      console.log("Course data:", courseData);
      setCourse(courseData.course);
    } catch (error) {
      toast.error("Erro ao carregar dados do curso");
      console.error("Failed to fetch course:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, fetchCourseData]);

  const onHandleCreateLesson = (moduleId: string) => {
    router.push(`/criar-aula/${moduleId}`);
  };

  const onHandleUpdateLesson = (moduleId: string, classId: string) => {
    router.push(`/atualizar-aula/${moduleId}?aulaId=${classId}`);
  };

  const openDeleteModal = (moduleId: string, classId: string) => {
    setClassToDelete({ moduleId, classId });
    setModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setModalIsOpen(false);
    setClassToDelete(null);
  };

  const onHandleDeleteLesson = async () => {
    if (!classToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      const toastId = toast.loading("Excluindo aula...");

      await api.patch(`/api/module/${classToDelete.moduleId}`, {
        deletedClasses: [classToDelete.classId],
      });

      toast.success("Aula excluída com sucesso!", { id: toastId });

      closeDeleteModal();

      await fetchCourseData();
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao excluir aula:", error);
      toast.error(error?.message || "Erro ao excluir aula. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const onHandleCreateModule = () => {
    router.push(`/criar-modulo/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl m-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <h1 className="text-3xl font-bold text-gray-900">
            Curso não encontrado
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        style={customStyles}
        contentLabel="Confirmar exclusão"
      >
        <div className="p-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Confirmar exclusão
          </h2>
          <p className="text-gray-700 mb-6">
            Tem certeza que deseja excluir esta aula? Esta ação não pode ser
            desfeita.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              onClick={onHandleDeleteLesson}
              className={`px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer ${
                isDeleting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </Modal>
      <header className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Curso: {course.name}
          </h1>
          <div className="flex gap-6 mt-4 text-gray-600">
            <span>{course.enrollments?.length} alunos inscritos</span>
            <span>{course.modules?.length} módulos</span>
            <span>
              {course.modules?.reduce(
                (acc, module) => acc + module.classes.length,
                0
              )}{" "}
              aulas
            </span>
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
              d="M4 2L13.3333 8L4 14V2Z"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium">Publicar trabalho</span>
        </button>
      </div>
      <hr />
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Estrutura do Curso
          </h2>
          <button
            className="flex items-center justify-between font-medium cursor-pointer py-3 px-2 w-[200px] bg-[#2563EB] hover:bg-[#2564ebd8] text-white rounded-md"
            onClick={onHandleCreateModule}
          >
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
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.51562 3.33325V12.6666"
                stroke="#FAFAFA"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Adicionar Módulo</span>
            <div />
          </button>
        </div>
        {course.modules?.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-lg shadow border mb-6 overflow-hidden"
          >
            <div className="flex justify-between p-6 border-b bg-[#F9FAFB]">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {module.name}
                </h3>
                <span className="text-gray-600">
                  {module.classes.length} aulas
                </span>
              </div>
              <button
                className="flex items-center justify-between font-medium cursor-pointer py-2 px-2 w-[140px] bg-[#16A34A] hover:bg-[#16a34ac4] text-white rounded-md"
                onClick={() => onHandleCreateLesson(module.id)}
              >
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
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.51562 3.33325V12.6666"
                    stroke="#FAFAFA"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  onClick={() => onHandleCreateLesson(module.id)}
                  className="text-[14px]"
                >
                  Adicionar Aula
                </span>
                <div />
              </button>
            </div>

            <div className="divide-y">
              {module.classes?.map((lesson) => (
                <div key={lesson.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        {lesson.type === "video" && (
                          <>
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
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="bg-[#F3F4F6] px-[5px] rounded-md">
                              <span className="text-[#6B7280] text-[12px] font-medium">
                                Vídeo
                              </span>
                            </div>
                          </>
                        )}
                        {lesson.type === "text" && (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.99996 1.33325H3.99996C3.64634 1.33325 3.3072 1.47373 3.05715 1.72378C2.8071 1.97382 2.66663 2.31296 2.66663 2.66659V13.3333C2.66663 13.6869 2.8071 14.026 3.05715 14.2761C3.3072 14.5261 3.64634 14.6666 3.99996 14.6666H12C12.3536 14.6666 12.6927 14.5261 12.9428 14.2761C13.1928 14.026 13.3333 13.6869 13.3333 13.3333V4.66659L9.99996 1.33325Z"
                                stroke="#16A34A"
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9.33337 1.33325V3.99992C9.33337 4.35354 9.47385 4.69268 9.7239 4.94273C9.97395 5.19278 10.3131 5.33325 10.6667 5.33325H13.3334"
                                stroke="#16A34A"
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6.66671 6H5.33337"
                                stroke="#16A34A"
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.6667 8.66675H5.33337"
                                stroke="#16A34A"
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.6667 11.3333H5.33337"
                                stroke="#16A34A"
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="bg-[#F3F4F6] px-[5px] rounded-md">
                              <span className="text-[#6B7280] text-[12px] font-medium">
                                Texto
                              </span>
                            </div>
                          </>
                        )}
                        {lesson.type === "quiz" && (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_102_1759)">
                                <path
                                  d="M8.00004 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8.00004 1.33325C4.31814 1.33325 1.33337 4.31802 1.33337 7.99992C1.33337 11.6818 4.31814 14.6666 8.00004 14.6666Z"
                                  stroke="#9333EA"
                                  strokeWidth="1.33333"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6.06006 5.99989C6.21679 5.55434 6.52616 5.17863 6.93336 4.93931C7.34056 4.7 7.81932 4.61252 8.28484 4.69237C8.75036 4.77222 9.1726 5.01424 9.47678 5.37558C9.78095 5.73691 9.94743 6.19424 9.94673 6.66656C9.94673 7.99989 7.94673 8.66656 7.94673 8.66656"
                                  stroke="#9333EA"
                                  strokeWidth="1.33333"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M8 11.3333H8.00667"
                                  stroke="#9333EA"
                                  strokeWidth="1.33333"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_102_1759">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <div className="bg-[#F3F4F6] px-[5px] rounded-md">
                              <span className="text-[#6B7280] text-[12px] font-medium">
                                Quiz
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col ml-3">
                        <p className="font-normal text-gray-900">
                          {lesson.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <span
                        onClick={() =>
                          onHandleUpdateLesson(module.id, lesson.id)
                        }
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
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
                      </span>
                      <span
                        onClick={openDeleteModal.bind(
                          null,
                          module.id,
                          lesson.id
                        )}
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 4H14"
                            stroke="currentColor"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.6666 4V13.3333C12.6666 14 11.9999 14.6667 11.3333 14.6667H4.66659C3.99992 14.6667 3.33325 14 3.33325 13.3333V4"
                            stroke="currentColor"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.33325 3.99992V2.66659C5.33325 1.99992 5.99992 1.33325 6.66659 1.33325H9.33325C9.99992 1.33325 10.6666 1.99992 10.6666 2.66659V3.99992"
                            stroke="currentColor"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.66675 7.33325V11.3333"
                            stroke="currentColor"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.33325 7.33325V11.3333"
                            stroke="currentColor"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
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

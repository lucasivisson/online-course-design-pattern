"use client";

import { api } from "@/config/api";
import { CourseEntity } from "@/entities/course-entity";
import { ModuleEntity } from "@/entities/module-entity";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { BiDuplicate } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import Modal from "react-modal";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseService } from "@/services/course-service";
import ArrowIcon from "@/assets/arrow.svg";

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
  const [isCompletingClassIds, setIsCompletingClassIds] = useState<string[]>(
    []
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<{
    moduleId: string;
    classId: string;
  } | null>(null);
  const [duplicateModalIsOpen, setDuplicateModalIsOpen] = useState(false);
  const [moduleToDuplicate, setModuleToDuplicate] = useState<string | null>(
    null
  );
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [lessonsFinished, setLessonsFinished] = useState<string[]>([]);
  const [modulesFinished, setModulesFinished] = useState<string[]>([]);
  const [newModuleName, setNewModuleName] = useState("");

  const openDuplicateModal = (moduleId: string) => {
    setModuleToDuplicate(moduleId);
    setDuplicateModalIsOpen(true);
  };

  const closeDuplicateModal = () => {
    setDuplicateModalIsOpen(false);
    setModuleToDuplicate(null);
  };

  const { isTeacher, userId } = useAuth();

  const fetchCourseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const courseData = await api.get<{ course: CourseEntity }>(
        `/api/course/${courseId}`
      );

      setCourse(courseData.course);

      const userEnrollment = courseData.course.enrollments?.find(
        (enrollment) => enrollment.studentId === userId
      );

      if (userEnrollment) {
        setLessonsFinished(userEnrollment.finishedClassesIds || []);
        setModulesFinished(userEnrollment.finishedModulesIds || []);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do curso");
      console.error("Failed to fetch course:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, userId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, fetchCourseData]);

  const onHandleCreateLesson = (moduleId: string) => {
    router.push(`/criar-aula/${moduleId}`);
  };

  const onHandleDuplicateModule = async () => {
    if (!moduleToDuplicate || isDuplicating) return;

    if (!newModuleName.trim()) {
      toast.error("Por favor, insira um nome para o novo módulo");
      return;
    }

    try {
      setIsDuplicating(true);
      const toastId = toast.loading("Duplicando módulo...");

      const data = await api.post<ModuleEntity>(
        `/api/module/${moduleToDuplicate}/duplicate`,
        {
          name: newModuleName,
        }
      );

      await api.patch(`/api/course/${courseId}`, {
        modulesIds: [data.id],
      });
      toast.success("Módulo duplicado com sucesso!", { id: toastId });
      closeDuplicateModal();
      await fetchCourseData();
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao duplicar módulo:", error);
      toast.error(
        error?.message || "Erro ao duplicar módulo. Tente novamente."
      );
    } finally {
      setIsDuplicating(false);
    }
  };

  const onHandleUpdateLesson = (moduleId: string, classId: string) => {
    router.push(`/atualizar-aula/${moduleId}?aulaId=${classId}`);
  };

  const onHandleCreateQuiz = () => {
    router.push(`/criar-quiz`);
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

  const handleMarkAsCompleted = async (lessonId: string) => {
    if (!userId) return;

    try {
      setIsCompletingClassIds([...isCompletingClassIds, lessonId]);
      const toastId = toast.loading("Concluindo atividade...");
      await CourseService.completeLesson({ courseId, lessonId, userId });
      await fetchCourseData();
      toast.success("Atividade concluída com sucesso!", { id: toastId });
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao marcar aula como finalizada:", error);
      toast.error(
        error?.message ||
          "Erro ao marcar aula como finalizada. Tente novamente."
      );
    } finally {
      setIsCompletingClassIds([]);
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    return modulesFinished.includes(moduleId);
  };

  const isCourseCompleted = () => {
    if (!course?.modules?.length) return false;
    return course.modules.every((module) => isModuleCompleted(module.id));
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
  console.log("🟢 !isTeacher && isCourseCompleted()", isCourseCompleted());

  if (!isTeacher && isCourseCompleted()) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="#16A34A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#16A34A"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              Parabéns! 🎉
            </h1>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">
              Você completou o curso &ldquo;{course.name}&rdquo;
            </h2>
            <p className="text-lg text-green-600 mb-8">
              Você finalizou todos os módulos e aulas deste curso com sucesso.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => router.push("/meus-cursos")}
                variant="blue"
                className="px-6 py-3"
              >
                Ver Meus Cursos
              </Button>
              <Button
                onClick={() => router.push("/cursos")}
                variant="gray-50"
                className="px-6 py-3"
              >
                Explorar Outros Cursos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
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
      <Modal
        isOpen={duplicateModalIsOpen}
        onRequestClose={closeDuplicateModal}
        style={customStyles}
        contentLabel="Confirmar duplicação"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Duplicar Módulo
          </h2>

          <div className="mb-4">
            <label
              htmlFor="moduleName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Novo Módulo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="moduleName"
              className="placeholder:text-gray-500 text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              placeholder="Ex: Módulo 1 (Cópia)"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={closeDuplicateModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              disabled={isDuplicating}
            >
              Cancelar
            </button>
            <button
              onClick={onHandleDuplicateModule}
              className={`px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md ${
                isDuplicating ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isDuplicating || !newModuleName.trim()}
            >
              {isDuplicating ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  Duplicando...
                </>
              ) : (
                "Confirmar Duplicação"
              )}
            </button>
          </div>
        </div>
      </Modal>
      <header className="flex justify-between">
        <div className="w-full">
          <div className="space-y-6 justify-between w-full">
            <Button
              href={isTeacher ? "/dashboard" : "/meus-cursos"}
              variant="gray-50"
              className="flex border-0 w-fit items-center gap-2"
            >
              <ArrowIcon className="size-4" />
              <span>Voltar para Meus Cursos</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isTeacher && <span>Gerenciar Curso:</span>} {course.name}
            </h1>
          </div>
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
      </header>
      <div className="mt-2 mb-8">
        <span className="bg-[#DCFCE7] px-2 py-[6px] rounded-2xl text-[#166534] font-semibold text-[12px]">
          Publicado
        </span>
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          className="flex cursor-pointer justify-center items-center gap-2 w-[25%] py-4 px-2 text-white bg-[#2563EB] hover:bg-[#2564ebd8] rounded-md transition-colors duration-200"
          href={`/curso/${courseId}/posts`}
          variant="blue"
        >
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
          <span className="font-medium">Ir para mural</span>
        </Button>

        {isTeacher && (
          <button
            onClick={onHandleCreateQuiz}
            className="flex cursor-pointer justify-center items-center gap-2 w-[25%] py-4 px-2 text-white bg-[#9333EA] hover:bg-[#9233eaa6] rounded-md transition-colors duration-200"
          >
            <svg
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5219 5.23337C12.4892 5.44803 12.5612 5.66537 12.7145 5.8187L13.7599 6.86403C14.0732 7.17737 14.2305 7.5887 14.2305 8.00003C14.2305 8.41137 14.0739 8.82203 13.7599 9.13603L12.6859 10.21C12.6137 10.2821 12.5256 10.3363 12.4287 10.3683C12.3318 10.4002 12.2288 10.4091 12.1279 10.394C11.8145 10.3474 11.5932 10.074 11.4825 9.77737C11.3854 9.51522 11.224 9.2817 11.013 9.09828C10.8021 8.91485 10.5484 8.78742 10.2753 8.72769C10.0022 8.66795 9.71845 8.67785 9.45018 8.75646C9.1819 8.83506 8.9377 8.97986 8.74003 9.17753C8.54236 9.3752 8.39756 9.6194 8.31896 9.88767C8.24035 10.1559 8.23046 10.4397 8.29019 10.7128C8.34992 10.9859 8.47735 11.2396 8.66078 11.4505C8.8442 11.6615 9.07772 11.8229 9.33987 11.92C9.6372 12.0307 9.90987 12.2514 9.95653 12.5654C9.97162 12.6663 9.96283 12.7693 9.93087 12.8662C9.89892 12.9631 9.84469 13.0512 9.77253 13.1234L8.6992 14.1967C8.55013 14.3463 8.37297 14.4649 8.1779 14.5458C7.98284 14.6267 7.77371 14.6682 7.56253 14.668C7.35151 14.6683 7.14251 14.6269 6.94756 14.5461C6.7526 14.4653 6.57553 14.3468 6.42653 14.1974L5.3812 13.152C5.30564 13.0763 5.21339 13.0194 5.11185 12.9858C5.01031 12.9523 4.90232 12.943 4.79653 12.9587C4.46787 13.008 4.23653 13.2947 4.11653 13.604C4.01595 13.8622 3.85259 14.0912 3.64123 14.2704C3.42987 14.4495 3.17718 14.5732 2.90602 14.6301C2.63485 14.687 2.35378 14.6755 2.08821 14.5964C1.82265 14.5174 1.58097 14.3734 1.38505 14.1775C1.18913 13.9816 1.04514 13.7399 0.966121 13.4744C0.887096 13.2088 0.875526 12.9277 0.932457 12.6565C0.989389 12.3854 1.11302 12.1327 1.29218 11.9213C1.47134 11.71 1.70036 11.5466 1.95853 11.446C2.26787 11.326 2.55453 11.0947 2.6032 10.766C2.61901 10.6603 2.60982 10.5523 2.57636 10.4508C2.5429 10.3493 2.4861 10.257 2.41053 10.1814L1.3652 9.13603C1.21576 8.98703 1.09725 8.80996 1.01648 8.61501C0.935707 8.42005 0.894264 8.21106 0.894533 8.00003C0.894533 7.5887 1.05187 7.17737 1.3652 6.86403L2.38253 5.8467C2.54253 5.6867 2.76987 5.61137 2.99387 5.6447C3.3372 5.69603 3.57853 5.9967 3.7092 6.31803C3.813 6.57253 3.97813 6.79741 4.18988 6.97264C4.40163 7.14787 4.65343 7.26801 4.92285 7.32236C5.19227 7.37672 5.47096 7.3636 5.73408 7.28417C5.99721 7.20474 6.23661 7.06147 6.43096 6.86712C6.62531 6.67277 6.76857 6.43337 6.848 6.17025C6.92743 5.90712 6.94055 5.62844 6.8862 5.35902C6.83184 5.08959 6.7117 4.83779 6.53647 4.62604C6.36124 4.41429 6.13636 4.24916 5.88187 4.14537C5.56053 4.0147 5.25987 3.77337 5.20853 3.43003C5.1752 3.20603 5.24987 2.97937 5.41053 2.8187L6.4272 1.80203C6.57618 1.6528 6.75316 1.53446 6.94799 1.4538C7.14282 1.37315 7.35167 1.33176 7.56253 1.33203C7.97387 1.33203 8.3852 1.48937 8.69853 1.8027L9.74387 2.84803C9.8972 3.00137 10.1145 3.07337 10.3285 3.04137C10.6572 2.99203 10.8885 2.70537 11.0085 2.39603C11.1091 2.13786 11.2725 1.90884 11.4838 1.72968C11.6952 1.55052 11.9479 1.42689 12.219 1.36996C12.4902 1.31303 12.7713 1.3246 13.0369 1.40362C13.3024 1.48264 13.5441 1.62663 13.74 1.82255C13.9359 2.01847 14.0799 2.26015 14.1589 2.52571C14.238 2.79128 14.2495 3.07235 14.1926 3.34352C14.1357 3.61468 14.012 3.86737 13.8329 4.07873C13.6537 4.29009 13.4247 4.45345 13.1665 4.55403C12.8572 4.67403 12.5705 4.9047 12.5219 5.23337Z"
                stroke="white"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="font-medium">Criar quiz</span>
          </button>
        )}
      </div>
      <hr />
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Estrutura do Curso
          </h2>
          {isTeacher && (
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
          )}
        </div>
        {course.modules?.length === 0 ? (
          <div className="text-gray-500 w-full text-center mt-20">
            Nenhum módulo encontrado
          </div>
        ) : (
          course.modules?.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow border mb-6 overflow-hidden"
            >
              <div className="flex justify-between p-6 border-b bg-[#F9FAFB]">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {module.name}
                    </h3>
                    <span className="text-gray-600">
                      {module.classes.length} aulas
                    </span>
                  </div>
                  {!isTeacher && isModuleCompleted(module.id) && (
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 12L11 14L15 10"
                          stroke="#16A34A"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="#16A34A"
                          strokeWidth="2"
                        />
                      </svg>
                      <span className="text-green-700 text-sm font-medium">
                        Concluído
                      </span>
                    </div>
                  )}
                </div>
                {isTeacher && (
                  <div className="flex gap-2">
                    <button
                      className="flex items-center justify-between font-medium cursor-pointer border border-[#E4E4E7] gap-2 px-4 py-2 text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      onClick={() => openDuplicateModal(module.id)}
                    >
                      <BiDuplicate />
                      <span className="text-[14px]">Duplicar Módulo</span>
                    </button>

                    {isTeacher && (
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
                    )}
                  </div>
                )}
              </div>

              <div className="divide-y">
                {module.classes?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <div className="flex justify-between w-full items-center">
                      <Link
                        href={`${lesson.videoUrl}`}
                        target="_blank"
                        className="flex items-center hover:underline decoration-blue-500"
                      >
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
                              <button className="bg-[#F3F4F6] px-[5px] rounded-md">
                                <span className="text-[#6B7280] text-[12px] font-medium">
                                  Vídeo
                                </span>
                              </button>
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
                      </Link>
                      {isTeacher && (
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
                      )}
                      {!isTeacher && (
                        <Button
                          onClick={() => handleMarkAsCompleted(lesson.id)}
                          variant="blue"
                          className="rounded-md"
                          disabled={
                            lessonsFinished.includes(lesson.id) ||
                            isCompletingClassIds.includes(lesson.id)
                          }
                        >
                          {isCompletingClassIds.includes(lesson.id) ? (
                            <FaSpinner className="animate-spin text-white" />
                          ) : lessonsFinished.includes(lesson.id) ? (
                            "Concluído"
                          ) : (
                            "Marcar como finalizado"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

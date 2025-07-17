"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/config/api";

interface Question {
  question: string;
  alternatives: string[];
  correctAnswer: number;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    alternatives: ["", ""],
    correctAnswer: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrentQuestion((prev) => ({ ...prev, question: value }));
  };

  const handleAlternativeChange = (index: number, value: string) => {
    const newAlternatives = [...currentQuestion.alternatives];
    newAlternatives[index] = value;
    setCurrentQuestion((prev) => ({ ...prev, alternatives: newAlternatives }));
  };

  const addAlternative = () => {
    if (currentQuestion.alternatives.length < 10) {
      setCurrentQuestion((prev) => ({
        ...prev,
        alternatives: [...prev.alternatives, ""],
      }));
    }
  };

  const removeAlternative = (index: number) => {
    if (currentQuestion.alternatives.length > 2) {
      const newAlternatives = [...currentQuestion.alternatives];
      newAlternatives.splice(index, 1);

      // Ajusta o índice da resposta correta se necessário
      let newCorrectAnswer = currentQuestion.correctAnswer;
      if (index < currentQuestion.correctAnswer) {
        newCorrectAnswer--;
      } else if (index === currentQuestion.correctAnswer) {
        newCorrectAnswer = 0; // Se remover a resposta correta, define a primeira como padrão
      }

      setCurrentQuestion((prev) => ({
        ...prev,
        alternatives: newAlternatives,
        correctAnswer: newCorrectAnswer,
      }));
    }
  };

  const addQuestion = () => {
    if (
      currentQuestion.question.trim() === "" ||
      currentQuestion.alternatives.some((alt) => alt.trim() === "") ||
      currentQuestion.alternatives.length < 2
    ) {
      toast.error("Preencha todos os campos da pergunta");
      return;
    }

    setQuestions((prev) => [...prev, currentQuestion]);
    setCurrentQuestion({
      question: "",
      alternatives: ["", ""],
      correctAnswer: 0,
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (questions.length === 0) {
      toast.error("Adicione pelo menos uma pergunta ao quiz");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        questions: questions,
      };

      const creatingPromise = api.post("/api/quiz", payload);

      toast.promise(creatingPromise, {
        loading: "Criando quiz...",
        success: () => {
          setTimeout(() => router.push("/dashboard"), 1000);
          return "Quiz criado com sucesso!";
        },
        error: (err) => {
          console.error("Erro ao criar quiz:", err);
          return err.message || "Ocorreu um erro ao criar o quiz";
        },
      });
    } catch (err) {
      console.error("Erro ao criar quiz:", err);
      toast.error("Ocorreu um erro ao criar o quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="bg-[#9233eaaf] p-4 rounded-full">
          <svg
            width="48"
            height="48"
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
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Criar Quiz</h1>
        <p className="text-gray-700">
          Monte um quiz interativo para avaliar o conhecimento dos seus alunos
          sobre o conteúdo do curso.
        </p>
      </div>

      <div className="bg-white shadow border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Informações do Quiz
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="quiz-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título do Quiz <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="quiz-name"
              name="name"
              className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Ex: Quiz: Padrões Criacionais, Avaliação Módulo 1..."
              value={formData.name}
              onChange={handleChange}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Escolha um título claro para identificar o quiz.
            </p>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Perguntas
            </h3>

            {questions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhuma pergunta adicionada</p>
                <p className="text-sm text-gray-400 mt-2">
                  Comece adicionando a primeira pergunta do seu quiz
                </p>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("question-form")?.scrollIntoView()
                  }
                  className="cursor-pointer mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Adicionar Primeira Pergunta
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-gray-900 font-medium">
                        Pergunta {qIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    <p className="font-medium text-gray-500">{q.question}</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {q.alternatives.map((alt, aIndex) => (
                        <li
                          key={aIndex}
                          className={
                            aIndex === q.correctAnswer
                              ? "text-green-600 font-medium"
                              : "text-gray-500"
                          }
                        >
                          {alt}{" "}
                          {aIndex === q.correctAnswer && "(Resposta correta)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div id="question-form" className="pt-6 border-t mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {questions.length > 0
                ? "Adicionar Nova Pergunta"
                : "Adicionar Pergunta"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pergunta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="placeholder:text-gray-500 text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                  placeholder="Digite a pergunta..."
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternativas <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {currentQuestion.alternatives.map((alt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            correctAnswer: index,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <input
                        type="text"
                        className="placeholder:text-gray-500 text-gray-500 flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder={`Alternativa ${index + 1}`}
                        value={alt}
                        onChange={(e) =>
                          handleAlternativeChange(index, e.target.value)
                        }
                      />
                      {currentQuestion.alternatives.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeAlternative(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {currentQuestion.alternatives.length < 10 && (
                  <button
                    type="button"
                    onClick={addAlternative}
                    className="cursor-pointer mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Adicionar Alternativa
                  </button>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Marque a alternativa correta e adicione pelo menos 2 opções
                  (máximo 10)
                </p>
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Adicionar Pergunta
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-8 border-t mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting
                  ? "opacity-75 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Publicando..." : "Publicar Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
        <div className="bg-[#dbeafe] p-4 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

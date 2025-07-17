"use client";

import { useState } from "react";
import { CourseEntity } from "@/entities/course-entity";
import { CourseCard } from "@/components/CourseCard";
import { CourseService } from "@/services/course-service";
import toast from "react-hot-toast";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/entities/enrollment-entity";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

interface BuyableCoursesSectionProps {
  courses: CourseEntity[];
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "pix", label: "Pix" },
  { value: "credit", label: "Cartão" },
  { value: "bankSlip", label: "Boleto" },
];

export default function BuyableCoursesSection({
  courses,
}: BuyableCoursesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseEntity | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);
  const [installments, setInstallments] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();

  if (!userId) {
    return redirect("/login");
  }

  const openModal = (course: CourseEntity) => {
    setSelectedCourse(course);
    setPaymentMethod(PAYMENT_METHODS[0].value);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
    setLoading(false);
  };

  const handleBuyCourse = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const creatingPromise = CourseService.buyCourse(
        selectedCourse.id,
        userId,
        {
          paymentMethod,
          installments,
        }
      );
      toast.promise(creatingPromise, {
        loading: "Comprando curso...",
        success: () => {
          return "Curso comprado com sucesso!";
        },
        error: (err) => {
          console.error("Erro ao comprar curso:", err);
          return err.message || "Ocorreu um erro ao comprar o curso";
        },
      });
      closeModal();
    } catch (err) {
      console.error("Erro ao comprar curso:", err);
      toast.error("Ocorreu um erro ao comprar o curso");
      setLoading(false);
    }
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum curso disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <CourseCard
            index={index}
            key={index}
            course={course}
            onClick={() => openModal(course)}
          />
        ))}
      </div>

      {modalOpen && selectedCourse && (
        <div className="fixed text-gray-800 inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <Button
              variant="link"
              className="absolute w-fit p-1 cursor-pointer top-2 right-2 text-gray-600  hover:text-gray-800"
              onClick={closeModal}
              disabled={loading}
              aria-label="Fechar"
            >
              <XIcon className="size-6" />
            </Button>
            <h2 className="text-xl font-semibold mb-4 ">
              Escolha o método de pagamento
            </h2>
            <div className="mb-4">
              <select
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="w-full p-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {paymentMethod === "pix" && (
                <div className="mt-2 text-green-600 font-medium">
                  Pix - 5% de desconto
                </div>
              )}
              {paymentMethod === "credit" && (
                <div className="mt-2">
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="installments"
                  >
                    Parcelas
                  </label>
                  <input
                    id="installments"
                    type="number"
                    min={1}
                    max={24}
                    defaultValue={1}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    onChange={(e) =>
                      setInstallments(Number(e.target.value) || undefined)
                    }
                  />
                  <span className="text-xs text-gray-500">1 a 24x</span>
                </div>
              )}
            </div>
            <Button
              className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              onClick={handleBuyCourse}
              disabled={loading}
            >
              {loading ? "Processando..." : `Comprar "${selectedCourse.name}"`}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

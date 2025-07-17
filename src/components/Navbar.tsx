"use client";

import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { TEACHER_ID } from "../shared/constants";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  showBackButton?: boolean;
  notificationCount?: number;
  userName?: string;
  userEmail?: string;
}

export function Navbar({ showBackButton = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { userId, isTeacher } = useAuth();

  if (pathname.startsWith("/login")) {
    return null;
  }

  const notificationCount = 7;
  const userName = userId === TEACHER_ID ? "Paulo Henrique Maia" : "João Silva";
  const userEmail =
    userId === TEACHER_ID ? "paulo.henrique@uece.br" : "joao.silva@email.com";

  const handleLogout = () => {
    router.push("/login");
  };

  const handleBack = () => {
    router.back();
  };

  const handleCreateCourse = () => {
    router.push("/criar-curso");
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900">
                Bem-vindo, {userName}
              </h1>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isTeacher && (
              <Button onClick={handleCreateCourse}>+ Criar Novo Curso</Button>
            )}
            <div className="relative">
              <Button
                variant="link"
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaBell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute rounded-full p-2 bg-red-500 -top-1 -right-1 red-500 text-white text-xs w-3 h-3 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </div>
            <Button
              variant="link"
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Sair"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

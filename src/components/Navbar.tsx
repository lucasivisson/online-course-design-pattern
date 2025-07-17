/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { TEACHER_ID } from "../shared/constants";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";
import { useNotifications } from "@/app/hooks/useNotifications";

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
  const { notifications, markNotificationAsRead, countNotReadedNotifications } =
    useNotifications();

  const [notificationsNotReaded, setNotificationsNotReaded] =
    useState<number>(0);

  useEffect(() => {
    const qtt = countNotReadedNotifications(notifications, userId || "");
    setNotificationsNotReaded(qtt);
  }, [userId, notifications]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const markAsSeen = async (id: string) => {
    try {
      await markNotificationAsRead(id, userId || "");
      setNotificationsNotReaded(notificationsNotReaded - 1);
    } catch (err) {
      console.log(err);
    }
  };

  if (pathname.startsWith("/login")) {
    return null;
  }

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

  console.log("userId", userId);
  const notificationIsReaded = (notificationId: string, userId: string) => {
    console.log("userId", userId);
    const notification = notifications.find(
      (notification) => notification.id === notificationId
    );
    console.log("notification", notification);
    if (notification?.readBy.includes(userId)) {
      console.log("entrou aq");
      return true;
    }
    console.log("n entrou");
    return false;
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
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                onClick={toggleDropdown}
              >
                <FaBell className="w-5 h-5" />
                <span className="absolute rounded-full p-2 bg-red-500 -top-1 -right-1 red-500 text-white text-xs w-3 h-3 flex items-center justify-center">
                  {notificationsNotReaded}
                </span>
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b font-semibold text-gray-700 flex justify-between items-center">
                    Notificações
                  </div>

                  <ul className="max-h-[50vh] overflow-y-auto divide-y">
                    {notifications?.length === 0 ? (
                      <li className="p-4 text-gray-500 text-sm">
                        Nenhuma notificação.
                      </li>
                    ) : (
                      notifications?.map((notification) => (
                        <li
                          key={notification.id}
                          className={`flex items-start justify-between gap-2 p-4 text-sm transition-colors ${
                            notificationIsReaded(notification.id, userId || "")
                              ? "bg-gray-50 text-gray-500"
                              : "bg-white text-gray-800"
                          } hover:bg-gray-100`}
                        >
                          <span>{notification.message}</span>
                          {!notificationIsReaded(
                            notification.id,
                            userId || ""
                          ) && (
                            <button
                              onClick={() => markAsSeen(notification.id)}
                              className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                              title="Marcar como lida"
                            >
                              <MdDone className="w-5 h-5" />
                            </button>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
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

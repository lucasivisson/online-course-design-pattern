// authContext.ts
"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { TEACHER_ID } from "../shared/constants";

// Tipos
type AuthContextType = {
  userId: string | null;
  login: (userId: string) => void;
  isAuthenticated: boolean;
  isTeacher: boolean;
};

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  const login = (id: string) => {
    setUserId(id);
  };

  const isAuthenticated = !!userId;

  return (
    <AuthContext.Provider
      value={{
        userId,
        login,
        isAuthenticated,
        isTeacher: userId === TEACHER_ID,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

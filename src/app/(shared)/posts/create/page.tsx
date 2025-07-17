"use client";
import { FileText } from "lucide-react";
import DocumentUploader from "./components/DocumentUploader";

export default function PostPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl rounded-lg p-8">
        <div className="flex items-center flex-col gap-5 justify-center text-center mb-8">
          <div className="p-2 w-15 h-15 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <FileText size={32} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Publicar Mensagem
            </h1>
            <p className="text-gray-600 mt-1">
              Crie uma nova mensagem para o curso. Defina a descrição e um
              documento opcional.
            </p>
          </div>
        </div>

        <DocumentUploader />
      </div>
    </div>
  );
}

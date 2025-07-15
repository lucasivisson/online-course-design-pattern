"use client";
import { Trash2, Upload } from "lucide-react";
import React, { useState, useRef } from "react";

const DocumentUploader = () => {
  const [message, setMessage] = useState("");
  const [document, setDocument] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setDocument({
        name: uploadedFile.name,
        type: uploadedFile.type,
      });
    }
  };

  const handleRemoveDocument = () => {
    setDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full mx-auto">
      {/* Message Input */}
      <h2 className="text-xl font-semibold text-gray-800 mb-12 text-center">
        Informações da Mensagem
      </h2>
      <div className="flex flex-col gap-3 mb-10">
        <label>Mensagem *</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          rows={4}
          placeholder="Escreva um aviso ou envie um documento para a turma"
          value={message}
          onChange={handleMessageChange}
        ></textarea>
      </div>

      {/* Document Upload/Display Area */}
      <div className="relative mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" // Hide the default input
          id="document-upload"
        />
        {document && (
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {document.name}
                </p>
                <p className="text-xs text-gray-500">{document.type}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveDocument}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 transition-colors cursor-pointer"
              aria-label="Remover documento"
            >
              <Trash2 />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons (can add a Post/Send button here if needed) */}
      <div className="flex justify-between">
        <button
          onClick={handleUploadButtonClick}
          className="p-2 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all cursor-pointer"
          aria-label="Fazer upload de documento"
        >
          <Upload size={20} /> {/* Ícone de Upload */}
        </button>

        <div className="flex gap-2">
          <button
            className="px-6 py-2 bg-transparent text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all cursor-pointer"
            // You would typically handle form submission here
            onClick={() =>
              console.log("Message:", message, "Document:", document)
            }
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all cursor-pointer"
            // You would typically handle form submission here
            onClick={() =>
              console.log("Message:", message, "Document:", document)
            }
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;

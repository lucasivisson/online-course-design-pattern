/* eslint-disable @typescript-eslint/no-unused-vars */
import { Trash2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

// Component for creating a new announcement/post, now accepting props
export const CreateComment = ({
  placeholder,
  onPublish,
  profileInitial = "U",
  textButton = "Publicar",
}: {
  placeholder: string;
  onPublish: (message?: string, file?: File) => void;
  profileInitial?: string;
  textButton?: string;
}) => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [document, setDocument] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFile = event.target.files[0] as File;
      if (uploadedFile) {
        setDocument(uploadedFile);
      }
    }
  };

  const handleRemoveDocument = () => {
    setDocument(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const handleMessageChange = (event: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setMessage(event.target.value);
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePublishClick = () => {
    try {
      onPublish(message, document); // Passa a mensagem e o documento
      setMessage(undefined); // Limpa a mensagem
      handleRemoveDocument(); // Remove o documento após a publicação
      setDocument(undefined);
      setMessage("");
    } catch (err) {
      console.log("ocorreu um erro");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg mr-3">
          {profileInitial}
        </div>
        <textarea
          className="flex-grow resize-none border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          rows={1}
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
      <div className="flex justify-end gap-3">
        <button
          onClick={handleUploadButtonClick}
          className="p-2 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all cursor-pointer"
          aria-label="Fazer upload de documento"
        >
          <Upload size={20} /> {/* Ícone de Upload */}
        </button>

        <div className="flex gap-2">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all cursor-pointer"
            // You would typically handle form submission here
            onClick={handlePublishClick}
            disabled={!message && !document}
          >
            {textButton}
          </button>
        </div>
      </div>
    </div>
  );
};

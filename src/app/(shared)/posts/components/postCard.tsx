import React, { useState } from "react";
import { TransformedPost } from "@/app/hooks/usePosts";

type PostProps = {
  post: TransformedPost;
  handleDeletePost: (id: string) => void;
};

const PostCard: React.FC<PostProps> = ({ post, handleDeletePost }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDelete = async () => {
    try {
      handleDeletePost(post.id); // Atualiza o estado no componente pai
    } catch (err) {
      console.error("Erro ao excluir post:", err);
      throw new Error();
    } finally {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="rounded-lg mb-4 relative">
      <div className="flex justify-between items-center">
        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() =>
              // TODO: Adjust to get correct id later
              setIsDropdownOpen((prev) =>
                post.authorId === "687281a5869b62998f6a72c3" ? !prev : prev
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={handleDelete}
              >
                Excluir postagem
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

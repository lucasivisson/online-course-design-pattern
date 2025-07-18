"use client";
import React, { useState } from "react";
import { CreateComment } from "./components/createPost";
import { PostService } from "@/services/post-service";
import { TransformedPost, usePosts } from "@/app/hooks/usePosts";
import { PostEntity } from "@/entities/post-entity";
import PostCard from "./components/postCard";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { TEACHER_ID } from "@/shared/constants";
import { Button } from "@/components/ui/button";
import ArrowIcon from "@/assets/arrow.svg";

interface AnnouncementPost {
  post: TransformedPost;
  refetchPosts?: () => void;
  handleUpdatePost: (post: PostEntity) => void;
  handleDeletePost: (postId: string) => void;
  userId: string | null;
}

// Componente para uma única postagem de anúncio
const AnnouncementPost = ({
  post,
  handleUpdatePost,
  handleDeletePost,
  userId,
}: AnnouncementPost) => {
  const { id, comments, author, time, content, file } = post;
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  // Estado para controlar quantos comentários estão sendo exibidos
  const [displayedCommentsCount, setDisplayedCommentsCount] = useState(0); // Começa com 0 para não mostrar nenhum inicialmente
  const COMMENTS_PER_LOAD = 5; // Constante para definir quantos comentários carregar por vez

  // Função para alternar a visibilidade da seção de comentários
  const toggleCommentsSection = () => {
    if (!showCommentsSection) {
      // Se a seção estiver oculta, exibe-a e mostra os primeiros COMMENTS_PER_LOAD comentários
      setShowCommentsSection(true);
      setDisplayedCommentsCount(Math.min(COMMENTS_PER_LOAD, comments.length));
    } else {
      // Se a seção estiver visível, oculta-a e reseta a contagem para 0
      setShowCommentsSection(false);
      setDisplayedCommentsCount(0);
    }
  };

  // Função para carregar mais comentários (COMMENTS_PER_LOAD por vez)
  const loadMoreComments = () => {
    setDisplayedCommentsCount((prevCount) =>
      Math.min(prevCount + COMMENTS_PER_LOAD, comments.length)
    );
  };

  // Função para recolher comentários (COMMENTS_PER_LOAD por vez)
  const showLessComments = () => {
    setDisplayedCommentsCount((prevCount) =>
      Math.max(prevCount - COMMENTS_PER_LOAD, COMMENTS_PER_LOAD)
    );
    if (displayedCommentsCount <= COMMENTS_PER_LOAD) {
      // Se recolher para 5 ou menos, esconde a seção
      setShowCommentsSection(false);
      setDisplayedCommentsCount(0); // Reseta a contagem para 0
    }
  };

  // Função para recolher todos os comentários de uma vez
  const collapseAllComments = () => {
    setShowCommentsSection(false);
    setDisplayedCommentsCount(0); // Reseta a contagem para 0
  };

  const visibleComments = comments.slice(0, displayedCommentsCount);
  const hasMoreComments = displayedCommentsCount < comments.length;
  const canShowLess = displayedCommentsCount > 0;

  // Função para adicionar um novo comentário (thread)
  const handleAddComment = async (message?: string, file?: File) => {
    if (userId) {
      try {
        // Usar um authorId fixo para simulação, em um app real viria do contexto de autenticação
        const post = await PostService.addThreadOnPost({
          postId: id,
          message,
          file,
          userId,
        });
        handleUpdatePost(post);
        // refetchPosts(); // Recarrega os posts para mostrar o novo comentário
      } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        throw new Error();
        // Exibir mensagem de erro para o usuário
      }
    }
  };

  const handlePostDeleted = async (id: string) => {
    if (userId) {
      try {
        // Usar um authorId fixo para simulação, em um app real viria do contexto de autenticação
        await PostService.delete({
          postId: id,
          userId,
        });
        handleDeletePost(id);
        // refetchPosts(); // Recarrega os posts para mostrar o novo comentário
      } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        throw new Error();
        // Exibir mensagem de erro para o usuário
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg mr-3">
            {author[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{author}</p>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
        </div>
        <PostCard
          key={post.id}
          post={post}
          handleDeletePost={handlePostDeleted}
          userId={userId}
        />
      </div>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{content}</p>
      {file && (
        <div className="flex items-center p-2 border border-gray-300 rounded-lg bg-gray-50 mb-4">
          {/* Ícone de arquivo genérico */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 mr-2"
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
            <p
              className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
              onClick={() => window.open(`/${file?.url}`, "_blank")}
            >
              {file?.fileName}
            </p>
            <p className="text-xs text-gray-500">{file.type}</p>
          </div>
        </div>
      )}

      {comments && comments.length > 0 && (
        <div className="mb-4">
          <button
            className="text-blue-600 hover:underline text-sm mb-2 flex items-center"
            onClick={toggleCommentsSection} // Usa a nova função
          >
            {comments.length} comentário{comments.length > 1 ? "s" : ""} para a
            turma
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transform transition-transform duration-200 ${
                showCommentsSection ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showCommentsSection && ( // Renderiza a seção de comentários apenas se showCommentsSection for true
            <>
              {visibleComments.map((comment, index) => (
                <div key={index} className="flex items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm mr-4 flex-shrink-0">
                    {comment.author[0]}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800 text-sm">
                      {comment.author}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">{comment.time}</p>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {comment.text}
                    </p>
                    {/* Exibir o arquivo anexado, se existir */}
                    {comment.file && (
                      <div className="flex items-center p-2 border border-gray-300 rounded-lg bg-gray-50 mt-2">
                        {/* Ícone de arquivo genérico */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500 mr-2"
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
                          <p
                            className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                            onClick={() =>
                              window.open(`/${comment.file?.url}`, "_blank")
                            }
                          >
                            {comment.file?.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {comment.file.type}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Botões de "Ver mais" e "Ver menos" / "Recolher tudo" */}
              <div className="flex mt-2 space-x-2">
                {hasMoreComments && (
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={loadMoreComments}
                  >
                    Ver mais{" "}
                    {Math.min(
                      COMMENTS_PER_LOAD,
                      comments.length - displayedCommentsCount
                    )}{" "}
                    comentários
                  </button>
                )}
                {canShowLess && ( // Exibe "Ver menos" e "Recolher tudo" apenas se mais de 5 comentários estiverem visíveis
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={showLessComments}
                    >
                      Ver menos
                    </button>
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={collapseAllComments}
                    >
                      Recolher tudo
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <CreateComment
        placeholder="Escreva um comentário nessa publicação"
        onPublish={handleAddComment}
        textButton="Comentar"
        profileInitial={userId === TEACHER_ID ? "P" : "E"}
      />
    </div>
  );
};

// Componente da Página Principal
const ClassroomPage = () => {
  const params = useParams();
  const courseId = params.id as string;
  const { userId } = useAuth();

  const {
    posts,
    loading,
    error,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  } = usePosts(courseId, userId);

  const handleNewAnnouncementPublish = async (
    message?: string,
    file?: File
  ) => {
    if (userId) {
      try {
        console.log("userId", userId);
        if (file || message) {
          const post = await PostService.create({
            courseId: courseId,
            message,
            file,
            userId,
          });
          handleAddPost(post);

          // refetchPosts(); // Recarrega os posts após a criação
        }
      } catch (err) {
        console.error("Erro ao criar novo anúncio:", err);
        throw new Error();
        // Exibir mensagem de erro para o usuário
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Carregando postagens...</p>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  //       <p className="text-red-600">Erro: {error}</p>
  //       <button
  //         className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  //         onClick={refetchPosts}
  //       >
  //         Tentar Novamente
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <Button
          href={`/curso/${courseId}`}
          variant="gray-50"
          className="flex border-0 w-fit items-center gap-2 mb-4"
        >
          <ArrowIcon className="size-4" />
          <span>Voltar para Meus Cursos</span>
        </Button>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <CreateComment
              placeholder="Escreva um aviso para sua turma"
              onPublish={handleNewAnnouncementPublish}
              profileInitial={userId === TEACHER_ID ? "P" : "E"}
              // profileInitial={currentUserId[0].toUpperCase()} // Usa a inicial do ID do usuário logado
            />
          </div>
          {posts.map((announcement) => (
            <AnnouncementPost
              post={announcement}
              key={announcement.id}
              handleUpdatePost={handleUpdatePost}
              handleDeletePost={handleDeletePost}
              userId={userId}
            />
          ))}
          {posts.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 mt-8">
              Nenhuma postagem encontrada para este curso.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;

import { FileEntity } from "@/entities/file-entity";
import { PostEntity } from "@/entities/post-entity";
import { PostService } from "@/services/post-service";
import { useCallback, useEffect, useState } from "react";

// --- Custom Hook para buscar posts ---
interface UsePostsResult {
  posts: TransformedPost[];
  loading: boolean;
  error: string | null;
  refetchPosts: () => void; // Função para recarregar os posts
  handleAddPost: (post: PostEntity) => void;
  handleUpdatePost: (post: PostEntity) => void;
  handleDeletePost: (id: string) => void;
}

interface TransformedComment {
  author: string;
  time: string; // Pode ser Date ou string formatada
  text: string | null;
  file: FileEntity | null;
}

export interface TransformedPost {
  id: string;
  author: string;
  authorId: string;
  time: string; // Pode ser Date ou string formatada
  content: string | null;
  comments: TransformedComment[];
  file: FileEntity | null;
  rawPost: PostEntity; // Manter a entidade original, se necessário
}

// Função auxiliar para formatar a data
const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Agora mesmo";
  if (diffMinutes < 60) return `${diffMinutes} min. atrás`;
  if (diffHours < 24)
    return `${diffHours} hora${diffHours > 1 ? "s" : ""} atrás`;
  if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? "s" : ""} atrás`;

  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
};

export const usePosts = (courseId: string): UsePostsResult => {
  const [posts, setPosts] = useState<TransformedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedPosts = await PostService.index({ courseId });
      const transformedPosts: TransformedPost[] = fetchedPosts.map((post) => ({
        id: post.id,
        author: post.authorName, // Usa nome mapeado ou o ID
        authorId: post.authorId,
        time: formatTime(new Date(post.createdAt)), // Formata a data de criação do post
        content: post.message,
        file: post.file,
        comments: post.thread.map((threadItem) => ({
          author: threadItem.authorName,
          time: formatTime(new Date(threadItem.createdAt)), // Formata a data de criação do comentário
          text: threadItem.message,
          file: threadItem.file,
        })),
        rawPost: post, // Guarda a postagem original se precisar
      }));
      setPosts(transformedPosts);
    } catch (err) {
      setError("Erro ao carregar postagens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]); // Dependências do useCallback

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Chama fetchPosts quando o hook é montado ou fetchPosts muda

  const handleAddPost = (post: PostEntity) => {
    setPosts((prevState) => [
      {
        id: post.id,
        author: post.authorName, // Usa nome mapeado ou o ID
        authorId: post.authorId,
        time: formatTime(new Date(post.createdAt)), // Formata a data de criação do post
        content: post.message,
        file: post.file,
        comments: post.thread.map((threadItem) => ({
          author: threadItem.authorName,
          time: formatTime(new Date(threadItem.createdAt)), // Formata a data de criação do comentário
          text: threadItem.message,
          file: threadItem.file,
        })),
        rawPost: post, // Guarda a postagem original se precisar
      },
      ...prevState,
    ]);
  };

  const handleUpdatePost = (post: PostEntity) => {
    setPosts((prevState) =>
      prevState.map((p) =>
        p.id === post.id
          ? {
              id: post.id,
              author: post.authorName,
              authorId: post.authorId,
              time: formatTime(new Date(post.createdAt)),
              content: post.message,
              file: post.file,
              comments: post.thread.map((threadItem) => ({
                author: threadItem.authorName,
                time: formatTime(new Date(threadItem.createdAt)),
                text: threadItem.message,
                file: threadItem.file,
              })),
              rawPost: post,
            }
          : p
      )
    );
  };

  const handleDeletePost = (id: string) => {
    setPosts((prevState) => prevState.filter((p) => p.id !== id));
  };

  // Função para recarregar os posts manualmente
  const refetchPosts = () => {
    console.log("executou aq?");
    fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    refetchPosts,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  };
};

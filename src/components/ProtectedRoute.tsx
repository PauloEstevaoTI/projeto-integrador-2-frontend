import { Navigate } from "react-router";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Aguarda um momento para o contexto carregar o usuário do localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Enquanto está verificando, mostra loading
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  const token = localStorage.getItem("token");

  // Se não houver usuário ou token, redireciona para login
  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

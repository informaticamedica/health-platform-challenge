import { LoadingSpinner, RedirectScreen } from "@ds";
import { useAuth } from "@/context/auth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, status } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!session; // Si hay sesión, está autenticado
  const isLoading = status === "loading";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-3">
        <LoadingSpinner color="text-sky-500" />
        <span>Cargando pagina...</span>
      </div>
    ); // Muestra algo mientras se verifica la sesión
  }

  if (!isAuthenticated) {
    return <RedirectScreen />; // Evita mostrar el contenido hasta que se redirija
  }

  return <>{children}</>;
};

export default AuthGuard;

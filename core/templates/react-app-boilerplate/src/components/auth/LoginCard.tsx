// frontend/src/components/LoginCard.tsx

import { LoadingSpinner, useToast, Button, Input } from "@ds";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const LoginCard = () => {
  const { session, status, signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result) {
      setLoading(false);
    }

    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      navigate("/patients");
    }
  };
  useEffect(() => {
    const token = session?.accessToken;

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expires = new Date(payload.exp * 1000);
      if (new Date(expires) < new Date()) {
        toast({
          title: "Sesión Expirada",
          description:
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          variant: "destructive",
        });
        signOut();
      }
    }

    if (session) {
      navigate("/patients");
    }
  }, [session, navigate, signOut, toast]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Ingresar</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            id="email"
            type="email"
            className="mt-1 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            id="password"
            type="password"
            className="mt-1 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 mt-4 flex items-center justify-center"
            disabled={loading}
          >
            <div className="flex ">
              {loading && <LoadingSpinner />} Ingresar
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};

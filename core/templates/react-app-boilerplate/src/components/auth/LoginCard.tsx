// frontend/src/components/LoginCard.tsx

import { LoadingSpinner, useToast, Button, Input } from "@ds";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HeartPulseIcon, ShieldCheckIcon } from "lucide-react";

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
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="grid overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden bg-gradient-to-b from-primary via-info to-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1 text-xs font-semibold tracking-[0.12em]">
              <HeartPulseIcon className="size-4 text-warning" />
              EMERGENCIAS SALUD
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight">
              Tu salud, protegida{" "}
              <span className="mt-3 inline-block rounded-full bg-warning px-5 py-2 text-warning-foreground">
                en todo momento
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/90">
              Accede a pacientes, observaciones y herramientas clinicas con una experiencia simple y segura.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-primary-foreground/90">
            <ShieldCheckIcon className="size-5 text-warning" />
            Plataforma con acceso autenticado y trazabilidad clinica.
          </div>
          <div className="pointer-events-none absolute right-6 top-8 text-5xl font-black text-warning">+</div>
          <div className="pointer-events-none absolute bottom-8 left-8 text-6xl font-black text-primary-foreground/80">+</div>
        </section>

        <section className="bg-tertiary p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="text-3xl font-extrabold text-primary">Ingresar</h2>
            <p className="mt-2 text-sm text-muted-foreground">Usa tus credenciales para acceder al panel de emergencias.</p>
            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email"
                id="email"
                type="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Contraseña"
                id="password"
                type="password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={loading}
              >
                {loading ? <LoadingSpinner className="h-4 w-4" color="text-white" /> : null}
                Ingresar
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

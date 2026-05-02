import { backend } from "@/services/backend";
import React, { createContext, useContext, useMemo, useState } from "react";

type Session = { accessToken?: string } | null;
type Status = "loading" | "authenticated" | "unauthenticated";

type AuthContextType = {
  session: Session;
  status: Status;
  signIn: (
    _: string,
    values: { email: string; password: string; redirect?: boolean }
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  getSession: () => Promise<Session>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = "auth_access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { accessToken: token } : null;
  });
  const [status, setStatus] = useState<Status>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? "authenticated" : "unauthenticated";
  });

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      status,
      signIn: async (_, values) => {
        try {
          const { data } = await backend.post("/auth/login", {
            email: values.email,
            password: values.password,
          });
          const accessToken = data?.data?.token as string | undefined;
          if (!accessToken) {
            return { error: "Invalid credentials" };
          }
          localStorage.setItem(TOKEN_KEY, accessToken);
          setSession({ accessToken });
          setStatus("authenticated");
          return {};
        } catch {
          return { error: "Invalid credentials" };
        }
      },
      signOut: async () => {
        localStorage.removeItem(TOKEN_KEY);
        setSession(null);
        setStatus("unauthenticated");
      },
      getSession: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { accessToken: token } : null;
      },
    }),
    [session, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

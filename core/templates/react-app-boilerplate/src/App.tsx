import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/layouts/Layout";
import { Toaster } from "@ds";
import { AuthProvider } from "@/context/auth";
import HomePage from "@/pages/index";
import ObservationsPage from "@/pages/patients/[id]/index";
import PatientsPage from "@/pages/patients/index";
import { Navigate, Route, Routes } from "react-router-dom";

function ProtectedPage({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Layout>{children}</Layout>
    </AuthGuard>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/patients"
          element={
            <ProtectedPage>
              <PatientsPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedPage>
              <ObservationsPage />
            </ProtectedPage>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

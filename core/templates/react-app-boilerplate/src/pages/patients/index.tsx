// import { Background } from "@/components/layouts/Background";
import { PatientCard } from "@/components/patients/Patient";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { useAuth } from "@/context/auth";
import usePatientStore from "@/hooks/useStore";
import { getPatients } from "@/services/backend";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientsPage = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const { setPatients, patients } = usePatientStore();

  useEffect(() => {
    const loadPatients = async () => {
      if (!session?.accessToken) {
        navigate("/");
        return;
      }
      const response = await getPatients(session.accessToken);
      if (response.error) {
        await signOut();
        navigate("/");
        return;
      }
      setPatients(response.data);
    };

    void loadPatients();
  }, [navigate, session?.accessToken, setPatients, signOut]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-teal-100 bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 p-6 text-white shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            <p className="mt-1 text-sm text-cyan-100">
              Gestiona altas, ediciones y eliminaciones desde una sola vista.
            </p>
          </div>
          <PatientFormModal mode="create" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      {patients.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
          Aun no hay pacientes cargados.
        </div>
      ) : null}
    </div>
  );
};

export default PatientsPage;

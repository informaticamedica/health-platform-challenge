// import { Background } from "@/components/layouts/Background";
import { PatientCard } from "@/components/patients/Patient";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { SectionBanner } from "@ds";
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

    loadPatients().catch((error: unknown) => {
      console.error("Error loading patients", error);
    });
  }, [navigate, session?.accessToken, setPatients, signOut]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <SectionBanner
        variant="primary"
        title="Pacientes"
        description="Gestiona altas, ediciones y eliminaciones desde una sola vista."
        action={<PatientFormModal mode="create" />}
      />

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

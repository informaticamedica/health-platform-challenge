// import { Background } from "@/components/layouts/Background";
import { PatientCard } from "@/components/patients/Patient";
import { useAuth } from "@/context/auth";
import usePatientStore from "@/hooks/useStore";
import { getPatients } from "@/services/backend";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

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
    <div>
      <div className="container mx-auto flex flex-col justify-start self-start p-6 pt-28">
        <h1 className="text-2xl font-semibold bg-slate-300 rounded p-2 w-fit ml-4">
          Lista de Pacientes
        </h1>
        <div className="mt-4 flex flex-wrap">
          {patients.map((patient) => (
            <PatientCard key={v4()} patient={patient} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;

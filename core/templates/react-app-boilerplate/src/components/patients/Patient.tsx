import { PatientTypeDto } from "@/types/dto.type";
import { Link } from "react-router-dom";

export const PatientCard = ({ patient }: { patient: PatientTypeDto }) => (
  <div
    key={patient.id}
    className="bg-gray-100 p-4 rounded-lg shadow m-4 w-80  "
  >
    <Link to={`/patients/${patient.id}`}>
      <span className="text-blue-500">
        {patient.name} ({patient.observations})
      </span>
    </Link>
    <div className="text-sm text-gray-600">
      <p>Género: {patient.gender}</p>
      <p>
        Fecha de nacimiento: {new Date(patient.birth_date).toLocaleDateString()}
      </p>
      <p>Dirección: {patient.address}</p>
    </div>
  </div>
);

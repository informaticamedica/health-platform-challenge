import ObservationModel from "./../models/observation.model";
import PatientModel, { Patient } from "../models/patient.model";
import dayjs from "dayjs";
import { ValidationError } from "./error.service";

// Crear paciente

const PatientService = {
  async create(patient: Omit<Patient, "id">) {
    try {
      const patients = await PatientModel.findAll(); // seria mas eficiente tener un model y hacer la consulta directamente en la DB
      // se toma como mpi que el paciente existe si tiene el mismo nombre, fecha de nacimiento y genero
      const patientExist = patients.some(
        (p) =>
          p.name === patient.name &&
          dayjs(p.birth_date).isSame(dayjs(patient.birth_date), "day") &&
          p.gender === patient.gender
      );

      if (patientExist) {
        throw new ValidationError("El paciente ya existe");
      }

      return await PatientModel.create(patient);
    } catch (error: any) {
      console.error("PatientService: Error al crear paciente ", error);
      throw error;
    }
  },
  async getObservations(patientId: string) {
    try {
      const observations = await ObservationModel.findAllByPatient(patientId);
      const components = await ObservationModel.findAllComponentsByPatient(
        patientId
      );
      const patient = await PatientModel.findById(patientId);

      return {
        ...patient,
        observations: observations.map((o) => ({
          ...o,
          components: components.filter((c) => c.observation_id === o.id),
        })),
      };
    } catch (error: any) {
      console.error("PatientService: Error al obtener observaciones ", error);
      throw error;
    }
  },
};

export default PatientService;

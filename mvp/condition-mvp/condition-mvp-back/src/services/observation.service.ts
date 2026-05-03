import ObservationModel from "./../models/observation.model";
import PatientModel from "../models/patient.model";

import { ValidationError } from "./error.service";
import { fhirR4 } from "@smile-cdr/fhirts";
import { loadLoincCsvToArray } from "../utils/loincLoader";
import UserModel from "../models/user.model";

// Crear paciente

const ObservationService = {
  getFhir: async (observationId: string) => {
    try {
      const observation = await ObservationModel.findOneById(observationId);
      if (!observation) throw new ValidationError("Observation not found");

      const patient = await PatientModel.findById(observation.patient_id);
      const user = await UserModel.findById(observation.user_id);

      const components = await ObservationModel.findAllComponentsByPatient(
        observation.patient_id
      );

      const baseLoinc = await loadLoincCsvToArray();

      const fhirObservation: fhirR4.Observation = {
        resourceType: "Observation",
        id: observation.id,
        status: "final",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/observation-category",
                code: observation.category,
                display: observation.category,
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: observation.code,
              display: baseLoinc.find(
                (loinc) => loinc.LOINC_NUM === observation.code
              )?.COMPONENT,
            },
          ],
          text: baseLoinc.find((loinc) => loinc.LOINC_NUM === observation.code)
            ?.COMPONENT,
        },
        subject: {
          reference: observation?.patient_id
            ? `Patient/${observation?.patient_id}`
            : undefined,
          display: patient?.name,
        },
        performer: [
          {
            reference: "Practitioner/" + user?.id,
            display: "Dr. " + user?.name,
          },
        ],
        effectiveDateTime: observation.date ?? "",
        component:
          components?.map((component) => {
            return {
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: component.code,
                    display: baseLoinc.find(
                      (loinc) => loinc.LOINC_NUM === component.code
                    )?.COMPONENT,
                  },
                ],
                text: baseLoinc.find(
                  (loinc) => loinc.LOINC_NUM === component.code
                )?.COMPONENT,
              },
              valueQuantity: {
                value: 120,
                unit: component.unit,
                system: "http://loinc.org",
                code: component.code,
              },
            };
          }) || [],
      };
      return fhirObservation;
    } catch (error: any) {
      console.error(
        "ObservationService: Error al obtener observaciones ",
        error
      );
      throw error;
    }
  },
  async getObservations(patientId: string) {
    try {
      const observations = await ObservationModel.findAllByPatient(patientId);
      const patient = await PatientModel.findById(patientId);
      return { ...patient, observations };
    } catch (error: any) {
      console.error(
        "ObservationService: Error al obtener observaciones ",
        error
      );
      throw error;
    }
  },
};

export default ObservationService;

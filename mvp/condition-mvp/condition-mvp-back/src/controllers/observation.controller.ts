import { Request, Response } from "express";
import ObservationModel from "../models/observation.model";
import RoutesService from "../services/routes.service";
import { idSchema } from "../types/patient.schema";
import { baseObservationSchema } from "../types/observation.schema";
import { NotFoundError } from "../services/error.service";
import PatientService from "../services/patient.service";
import ObservationService from "../services/observation.service";
import { loadLoincCsvToArray } from "../utils/loincLoader";

const OBSERVATION_CATEGORY_URL =
  "https://terminology.hl7.org/6.1.0/CodeSystem-observation-category.json";
let loincCache: Array<{ LOINC_NUM: string; COMPONENT: string }> | null = null;

// Lista las observaciones de un paciente
export const getObservations = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const patientId = RoutesService.getParamAsString(req.params.id);

    const patientObservations = await PatientService.getObservations(patientId);

    RoutesService.responseSuccess(res, patientObservations);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Lista las observaciones de un paciente
export const getFhirObservation = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const observationId = RoutesService.getParamAsString(req.params.id);

    const patientObservations = await ObservationService.getFhir(observationId);

    RoutesService.responseSuccess(res, patientObservations);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const getObservationCategories = async (_req: Request, res: Response) => {
  try {
    const response = await fetch(OBSERVATION_CATEGORY_URL);

    if (!response.ok) {
      throw new Error(`HL7 response status: ${response.status}`);
    }

    const payload = (await response.json()) as {
      concept?: Array<{ code?: string; display?: string; definition?: string }>;
    };

    const categories = (payload.concept ?? [])
      .filter((item) => item.code && item.display)
      .map((item) => ({
        code: item.code as string,
        display: item.display as string,
        definition: item.definition ?? item.display ?? "",
      }));

    RoutesService.responseSuccess(res, categories);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const getLoincSuggestions = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query ?? "")
      .trim()
      .toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 50);

    if (!loincCache) {
      loincCache = await loadLoincCsvToArray("src/db/csv/Loinc.csv");
    }

    const matches = loincCache
      .filter((item) => {
        if (!query) return true;
        return (
          item.LOINC_NUM.toLowerCase().includes(query) ||
          (item.COMPONENT ?? "").toLowerCase().includes(query)
        );
      })
      .slice(0, limit)
      .map((item) => ({
        code: item.LOINC_NUM,
        display: item.COMPONENT ?? item.LOINC_NUM,
      }));

    RoutesService.responseSuccess(res, matches);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Añade una nueva observación
export const addObservation = async (req: Request, res: Response) => {
  try {
    const user_id = RoutesService.getUserId(req);

    RoutesService.validationParams(req.params, idSchema);
    const patient_id = RoutesService.getParamAsString(req.params.id);

    const { patient_id: _ignoredPatientId, user_id: _ignoredUserId, ...payload } =
      req.body;
    RoutesService.validationBody(payload, baseObservationSchema);
    const {
      code,
      value,
      date,
      status = "final",
      category,
      components,
    } = payload;

    const observation = await ObservationModel.create({
      patient_id,
      user_id,
      code,
      value,
      date,
      status,
      category,
      components,
    });

    RoutesService.responseSuccess(
      res,
      { ...observation, status, category, components },
      201
    );
  } catch (error) {
    console.log({ error });

    RoutesService.responseError(res, error as any);
  }
};

// Añade una nueva observación
export const addObservationFhir = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const patient_id = RoutesService.getParamAsString(req.params.id);
    const { patient_id: _ignoredPatientId, user_id: _ignoredUserId, ...payload } =
      req.body;
    RoutesService.validationBody(payload, baseObservationSchema);
    const {
      code,
      value,
      date,
      status = "final",
      category,
      components,
    } = payload;
    const user_id = RoutesService.getUserId(req);
    console.log({
      code,
      value,
      date,
      status,
      category,
      components,
    });

    const observation = await ObservationModel.create({
      patient_id,
      user_id,
      code,
      value,
      date,
      status,
      category,
      components,
    });

    RoutesService.responseSuccess(res, observation, 201);
  } catch (error) {
    console.log({ error });

    RoutesService.responseError(res, error as any);
  }
};

//TODO: Eliminar, se reemplaza por updateObservationFhir
// Actualiza una observación existente
export const updateObservation = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const { id: _ignoredId, ...payload } = req.body;
    RoutesService.validationBody(payload, baseObservationSchema);
    const observationId = RoutesService.getParamAsString(req.params.id);
    const { code, value, date, status, category, components } = payload;
    const user_id = RoutesService.getUserId(req);

    const observation = await ObservationModel.findOneById(observationId);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    const editedObservation = await ObservationModel.update({
      id: observationId,
      code,
      value,
      date,
      patient_id: observation.patient_id,
      user_id,
      category: observation.category,
      status: observation.status,
    });

    RoutesService.responseSuccess(res, {
      ...editedObservation,
      status,
      category,
      components,
    });
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const updateObservationFhir = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const { id: _ignoredId, ...payload } = req.body;
    RoutesService.validationBody(payload, baseObservationSchema);
    const observationId = RoutesService.getParamAsString(req.params.id);
    const {
      code,
      value,
      date,
      status = "final",
      category,
      components,
    } = payload;
    const user_id = RoutesService.getUserId(req);

    const observation = await ObservationModel.findOneById(observationId);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    const editedObservation = await ObservationModel.update({
      id: observationId,
      code,
      value,
      date,
      patient_id: observation.patient_id,
      user_id,
      category,
      status,
      components,
    });

    RoutesService.responseSuccess(res, editedObservation);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Elimina una observación
export const deleteObservation = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const id = RoutesService.getParamAsString(req.params.id);

    const observation = await ObservationModel.findOneById(id);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    await ObservationModel.delete(id);

    RoutesService.responseSuccess(res, observation);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

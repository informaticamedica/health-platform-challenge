import { Request, Response } from "express";
import PatientModel, { Patient } from "../models/patient.model";
import PatientService from "../services/patient.service";
import { idSchema, patientSchema } from "../types/patient.schema";
import RoutesService from "../services/routes.service";
import { NotFoundError } from "../services/error.service";

// Lista todos los pacientes
export const getAllPatients = async (req: Request, res: Response) => {
  try {
    console.log("getAllPatients");

    const patients = await PatientModel.findAll();
    RoutesService.responseSuccess(res, patients);
  } catch (error) {
    console.log({ error });

    RoutesService.responseError(res, error as any);
  }
};

// Obtiene un paciente por ID
export const getPatientById = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const id = RoutesService.getParamAsString(req.params.id);

    const patient = await PatientModel.findById(id);
    if (!patient)
      throw new NotFoundError("Paciente no encontrado con id = " + id);

    RoutesService.responseSuccess(res, patient);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Agrega un nuevo paciente
export const createPatient = async (req: Request, res: Response) => {
  try {
    RoutesService.validationBody<Patient>(req.body, patientSchema);

    const { name, birth_date, gender, address } = req.body;

    const newPatient = await PatientService.create({
      name,
      birth_date,
      gender,
      address,
    });

    RoutesService.responseSuccess(res, newPatient, 201);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Editar un paciente
export const updatePatient = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    RoutesService.validationBody(req.body, patientSchema);

    const id = RoutesService.getParamAsString(req.params.id);
    const { name, birth_date, gender, address } = req.body;

    const updatedPatient = await PatientModel.update({
      name,
      birth_date,
      gender,
      address,
      id,
    });

    RoutesService.responseSuccess(res, updatedPatient);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Elimina un paciente
export const deletePatient = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const id = RoutesService.getParamAsString(req.params.id);

    const deletedPatient = await PatientModel.delete(id);
    if (!deletedPatient)
      throw new NotFoundError("Paciente no encontrado con id = " + id);

    RoutesService.responseSuccess(res, deletedPatient);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

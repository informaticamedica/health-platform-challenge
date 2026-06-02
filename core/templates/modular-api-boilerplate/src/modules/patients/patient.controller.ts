import type { Request, Response } from 'express';

import { patientIdSchema, patientSchema } from './patient.schemas';
import { PatientService } from './patient.service';

import { sendCompatError, sendCompatSuccess } from '../../shared/http/compat-response';

export class PatientController {
  private readonly service = new PatientService();

  public findAll = async (_req: Request, res: Response): Promise<void> => {
    sendCompatSuccess(res, await this.service.findAll());
  };

  public findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = patientIdSchema.parse(req.params);
      sendCompatSuccess(res, await this.service.findById(id));
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const patient = await this.service.create(patientSchema.parse(req.body));
      sendCompatSuccess(res, patient, 201);
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = patientIdSchema.parse(req.params);
      const patient = await this.service.update(id, patientSchema.parse(req.body));
      sendCompatSuccess(res, patient);
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = patientIdSchema.parse(req.params);
      sendCompatSuccess(res, await this.service.delete(id));
    } catch (error) {
      sendCompatError(res, error);
    }
  };
}

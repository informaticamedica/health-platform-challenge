import type { Request, Response } from 'express';

import { patientIdSchema, patientSchema } from './patient.schemas';
import { PatientService } from './patient.service';

import { sendCompatError, sendCompatSuccess } from '../../shared/http/compat-response';

export class PatientController {
  private readonly service = new PatientService();

  public findAll = (_req: Request, res: Response): void => {
    sendCompatSuccess(res, this.service.findAll());
  };

  public findById = (req: Request, res: Response): void => {
    try {
      const { id } = patientIdSchema.parse(req.params);
      sendCompatSuccess(res, this.service.findById(id));
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public create = (req: Request, res: Response): void => {
    try {
      const patient = this.service.create(patientSchema.parse(req.body));
      sendCompatSuccess(res, patient, 201);
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public update = (req: Request, res: Response): void => {
    try {
      const { id } = patientIdSchema.parse(req.params);
      const patient = this.service.update(id, patientSchema.parse(req.body));
      sendCompatSuccess(res, patient);
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public delete = (req: Request, res: Response): void => {
    try {
      const { id } = patientIdSchema.parse(req.params);
      sendCompatSuccess(res, this.service.delete(id));
    } catch (error) {
      sendCompatError(res, error);
    }
  };
}

import type { AuthenticatedRequest } from '../../shared/auth/auth.types';
import type { Request, Response } from 'express';

import { observationIdSchema, observationSchema } from './observation.schemas';
import { ObservationService } from './observation.service';

import { unauthorizedError } from '../../shared/errors/compat-error';
import { sendCompatError, sendCompatSuccess } from '../../shared/http/compat-response';

export class ObservationController {
  private readonly service = new ObservationService();

  public findByPatientId = (req: Request, res: Response): void => {
    try {
      const { id } = observationIdSchema.parse(req.params);
      sendCompatSuccess(res, this.service.findByPatientId(id));
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public createForPatient = (req: AuthenticatedRequest, res: Response): void => {
    try {
      if (!req.userId) throw unauthorizedError();

      const { id } = observationIdSchema.parse(req.params);
      const observation = this.service.createForPatient(id, req.userId, observationSchema.parse(req.body));
      sendCompatSuccess(res, observation, 201);
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public update = (req: AuthenticatedRequest, res: Response): void => {
    try {
      if (!req.userId) throw unauthorizedError();

      const { id } = observationIdSchema.parse(req.params);
      const observation = this.service.update(id, req.userId, observationSchema.parse(req.body));
      sendCompatSuccess(res, observation);
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public delete = (req: Request, res: Response): void => {
    try {
      const { id } = observationIdSchema.parse(req.params);
      sendCompatSuccess(res, this.service.delete(id));
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public categories = (_req: Request, res: Response): void => {
    sendCompatSuccess(res, this.service.categories());
  };

  public loincSuggestions = (req: Request, res: Response): void => {
    const query = String(req.query.query ?? '').trim().toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 50);
    sendCompatSuccess(res, this.service.loincSuggestions(query, limit));
  };

  public fhir = (req: Request, res: Response): void => {
    try {
      const { id } = observationIdSchema.parse(req.params);
      sendCompatSuccess(res, this.service.toFhir(id));
    } catch (error) {
      sendCompatError(res, error);
    }
  };
}

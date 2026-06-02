import { ZodError } from 'zod';

import type { Response } from 'express';

import { CompatError } from '../errors/compat-error';

export const sendCompatSuccess = <T>(res: Response, data: T, status = 200): void => {
  res.status(status).json({ data, error: false });
};

export const sendCompatError = (res: Response, error: unknown): void => {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues.map((issue) => issue.message).join(', '), error: 'BodyError' });
    return;
  }

  const safeError =
    error instanceof CompatError
      ? error
      : new CompatError('Error desconocido', 500, 'Error');

  res.status(safeError.status).json({ message: safeError.message, error: safeError.name });
};

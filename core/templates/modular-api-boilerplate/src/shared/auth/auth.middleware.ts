import type { AuthenticatedRequest } from './auth.types';
import type { NextFunction, Response } from 'express';

import { TokenRepository } from './token.repository';

import { unauthorizedError } from '../errors/compat-error';
import { sendCompatError } from '../http/compat-response';

const tokenRepository = new TokenRepository();

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw unauthorizedError();

    const userId = tokenRepository.findUserId(token);
    if (!userId) throw unauthorizedError();

    req.userId = userId;
    next();
  } catch (error) {
    sendCompatError(res, error);
  }
};

export { tokenRepository };

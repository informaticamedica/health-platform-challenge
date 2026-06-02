import type { Request, Response } from 'express';

import { loginSchema, registerSchema } from './auth.schemas';
import { AuthService } from './auth.service';

import { sendCompatError, sendCompatSuccess } from '../../shared/http/compat-response';

export class AuthController {
  private readonly service = new AuthService();

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.service.register(registerSchema.parse(req.body));
      sendCompatSuccess(res, user, 201);
    } catch (error) {
      sendCompatError(res, error);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = await this.service.login(loginSchema.parse(req.body));
      sendCompatSuccess(res, token, 201);
    } catch (error) {
      sendCompatError(res, error);
    }
  };
}

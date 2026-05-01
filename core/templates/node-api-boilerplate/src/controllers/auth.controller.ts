import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import RoutesService from "../services/routes.service";
import { loginSchema, registerSchema } from "../types/user.schema";
import { UnauthorizedError, ValidationError } from "../services/error.service";

export const register = async (req: Request, res: Response) => {
  try {
    RoutesService.validationBody(req.body, registerSchema);
    const { name, email, password } = req.body;

    const existUser = await UserModel.findOne({ email });
    if (existUser) throw new ValidationError("El usuario ya existe");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    RoutesService.responseSuccess(res, user, 201);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    RoutesService.validationBody(req.body, loginSchema);

    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedError("Credenciales inválidas");

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "8h",
      }
    );

    RoutesService.responseSuccess(res, { token }, 201);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

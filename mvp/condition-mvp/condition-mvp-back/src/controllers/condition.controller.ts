import { Request, Response } from "express";
import ConditionModel from "../models/condition.model";
import ConditionService from "../services/condition.service";
import { NotFoundError } from "../services/error.service";
import RoutesService from "../services/routes.service";
import { conditionIdSchema, conditionSchema } from "../types/condition.schema";

export const getConditions = async (_req: Request, res: Response) => {
  try {
    const conditions = await ConditionService.list();
    RoutesService.responseSuccess(res, conditions);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const getConditionById = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, conditionIdSchema);
    const id = RoutesService.getParamAsString(req.params.id);
    const condition = await ConditionModel.findById(id);
    if (!condition) throw new NotFoundError("Condition no encontrada");
    RoutesService.responseSuccess(res, condition);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const getConditionsByPatient = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, conditionIdSchema);
    const patientId = RoutesService.getParamAsString(req.params.id);
    const conditions = await ConditionService.listByPatient(patientId);
    RoutesService.responseSuccess(res, conditions);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const createCondition = async (req: Request, res: Response) => {
  try {
    RoutesService.validationBody(req.body, conditionSchema);
    const userId = RoutesService.getUserId(req);
    const condition = await ConditionService.create({
      ...req.body,
      notes: req.body.notes ?? "",
      created_by: userId,
    });
    RoutesService.responseSuccess(res, condition, 201);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const updateCondition = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, conditionIdSchema);
    RoutesService.validationBody(req.body, conditionSchema);
    const id = RoutesService.getParamAsString(req.params.id);
    const condition = await ConditionService.update(id, {
      ...req.body,
      notes: req.body.notes ?? "",
    });
    if (!condition) throw new NotFoundError("Condition no encontrada");
    RoutesService.responseSuccess(res, condition);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

export const deleteCondition = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, conditionIdSchema);
    const id = RoutesService.getParamAsString(req.params.id);
    const condition = await ConditionModel.findById(id);
    if (!condition) throw new NotFoundError("Condition no encontrada");
    await ConditionModel.delete(id);
    RoutesService.responseSuccess(res, condition);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

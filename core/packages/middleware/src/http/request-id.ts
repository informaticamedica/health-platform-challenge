import { Request, Response, NextFunction } from "express";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = req.header("x-request-id") || `req-${Date.now()}`;
  res.setHeader("x-request-id", requestId);
  next();
}

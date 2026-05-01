import { Request, Response, NextFunction } from "express";

interface ErrorHandler extends Error {
  status?: number;
}

// Middleware de manejo de errores
const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500; // Estado HTTP del error, por defecto 500
  const message = err.message || "Error interno del servidor";

  // Log del error en modo desarrollo
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Error] ${err.stack || err}`);
  }

  // Respuesta JSON
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }), // Enviar stack trace en desarrollo
  });
};

export default errorMiddleware;

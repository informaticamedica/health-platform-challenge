export class CompatError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number, name: string) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export const bodyError = (message = 'Body invalido'): CompatError =>
  new CompatError(message, 400, 'BodyError');

export const paramsError = (message = 'Parametro invalido'): CompatError =>
  new CompatError(message, 400, 'ParamsError');

export const validationError = (message: string): CompatError =>
  new CompatError(message, 400, 'ValidationError');

export const unauthorizedError = (message = 'No autorizado'): CompatError =>
  new CompatError(message, 401, 'UnauthorizedError');

export const notFoundError = (message: string): CompatError =>
  new CompatError(message, 404, 'NotFoundError');

export type ErrorType = { message: string; status: number; name: string };

export class ParamsError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ParamsError";
    this.status = 400;
  }
}

export class BodyError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "BodyError";
    this.status = 400;
  }
}

export class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export class DatabaseError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
    this.status = 500;
  }
}

export class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class UnauthorizedError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

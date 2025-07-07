import { HttpError } from "@/business/errors/http-error";

export const serverInternalError = (
  message: string = "Internal server error"
) => {
  return new HttpError(message, 500);
};

export const notFoundError = (message: string = "Resource not found") => {
  return new HttpError(message, 404);
};

export const badRequestError = (message: string = "Bad request") => {
  return new HttpError(message, 400);
};

export const unauthorizedError = (message: string = "Unauthorized") => {
  return new HttpError(message, 401);
};

export const forbiddenError = (message: string = "Forbidden") => {
  return new HttpError(message, 403);
};

export const conflictError = (message: string = "Conflict") => {
  return new HttpError(message, 409);
};

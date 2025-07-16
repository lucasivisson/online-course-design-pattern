import { ValidationError } from "class-validator";

const VALIDATION_ERROR_RESPONSE = {
  status: 422,
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export const errorHandler = (errors: ValidationError[]) => {
  const extractFields = (errs: ValidationError[], parent = ""): string[] => {
    return errs.flatMap((err) => {
      const fullPath = parent ? `${parent}.${err.property}` : err.property;

      if (err.children && err.children.length > 0) {
        return extractFields(err.children, fullPath);
      }

      return [fullPath];
    });
  };

  return new Response(
    JSON.stringify({
      message: "Validation failed",
      fields: extractFields(errors),
    }),
    VALIDATION_ERROR_RESPONSE
  );
};

export class HttpError extends Error {
  public status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

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

export const validationError = (message: string = "Validation failed") => {
  return new HttpError(message, 422);
};

export const handleError = (error: Error | unknown) => {
  if (error instanceof HttpError) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(
    JSON.stringify({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const handleSuccess = (data: unknown) => {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

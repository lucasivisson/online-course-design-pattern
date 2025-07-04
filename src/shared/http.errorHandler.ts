import { ValidationError } from "class-validator";

export const errorHandler = (errors: ValidationError[]) => {
  return new Response(
    JSON.stringify({
      message: "Validation failed",
      errors: errors.map((err) => ({
        field: err.property,
        constraints: err.constraints,
      })),
    }),
    {
      status: 422,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

import { ValidationError } from "class-validator";

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
    {
      status: 422,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

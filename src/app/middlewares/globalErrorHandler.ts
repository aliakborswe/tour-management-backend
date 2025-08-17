import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";
import { handlerDuplicateError } from "../helpers/handlerDuplicateError";
import { handlerCastError } from "../helpers/handlerCastError";
import { handlerZodError } from "../helpers/handlerZodError";
import { handlerValidationError } from "../helpers/handlerValidationError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(envVars.NODE_ENV === "development"){
    console.log(err)
  }

  let errorSources: any = [];
  let statusCode = 500;
  let message = `Something went wrong!! ${err.message}`;

  // Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Cast Error err or ObjectId err
  else if (err.name === "CastError") {
    const simplifiedError = handlerCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;

    errorSources = simplifiedError.errorSources;
  }
  // Mongoose Validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources;
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

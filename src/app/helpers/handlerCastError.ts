import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlerCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid Mongodb ObjectId. Please provide a valid id",
  };
};

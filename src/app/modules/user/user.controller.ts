/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err: any)=>{
//         console.log(err);
//         next(err);
//     })
// }

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;

    const updatedUser = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken
    );
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "User update successfully",
      data: updatedUser,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users Retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};

// route matching -> controller matching -> service matching -> database matching
// controller -> service -> database

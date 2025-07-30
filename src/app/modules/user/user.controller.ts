/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
// import AppError from "../../errorHelpers/AppError";


// const createUserFunction = async (req: Request, res: Response, next: NextFunction) => {
//     const user = await UserServices.createUser(req.body);

//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             user,
//         });
// }

// type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err: any)=>{
//         console.log(err);
//         next(err);
//     })
// }


// const createUser = async(req: Request, res: Response, next: NextFunction)=>{
//     try {
//         // throw new Error("Fake error")
//         // throw new AppError(httpStatus.BAD_REQUEST, "Fake error for testing");
        
//         createUserFunction(req, res);

//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             user,
//         });

//     } catch (err) {
//         console.error("Error creating user:", err);
//         next(err);
//     }
// }



const createUser = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
    const user = await UserServices.createUser(req.body);

        // res.status(httpStatus.CREATED).json({
        //     message: "User created successfully",
        //     user
        // });

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User created successfully",
            data: user,
        })
})


// const getAllUsers = async( req: Request, res: Response, next: NextFunction)=>{
//     try {
//         const users = await UserServices.getAllUsers();
        
//         res.status(httpStatus.OK).json({
//             message: "Users fetched successfully",
//             users,
//         });
        
//     } catch (err: any) {
//         console.error("Error fetching users:", err);
//         next(err);
        
//     }
// }

const getAllUsers = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //     message: "All Users Retrieved successfully",
    //     data: users,
    // });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Users Retrieved successfully",
        data: result.data,
        meta: result.meta,
    })
})

export const UserController = {
    createUser,
    getAllUsers,
};


// route matching -> controller matching -> service matching -> database matching
// controller -> service -> database
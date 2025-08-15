import  httpsStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from '../modules/user/user.interface';

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(401, "No token received, please login first");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpsStatus.BAD_REQUEST, "User does not exist");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpsStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpsStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "Your are not permitted to access this route");
      }
      req.user = verifiedToken; // pass the verifiedToke to controllers with global type Express
      next();
    } catch (err) {
      next(err);
    }
  };

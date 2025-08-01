import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpsStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { IsActive, IUser } from "../user/user.interface";
import { createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpsStatus.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpsStatus.UNAUTHORIZED,
      "Email or password is incorrect"
    );
  }

  // user -> login -> token (email, role, id) --- booking / payment / booking cancel / payment cancel
  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };
  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_ACCESS_SECRET,
  //   envVars.JWT_ACCESS_EXPIRES_IN
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_REFRESH_SECRET,
  //   envVars.JWT_REFRESH_EXPIRES_IN
  // );

  const userTokens = createUserTokens(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject(); // password not send to frontend with response

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// get new access token using refresh token
const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

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

  // user -> login -> token (email, role, id) --- booking / payment / booking cancel / payment cancel
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};

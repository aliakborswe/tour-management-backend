import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpsStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { IUser } from "../user/user.interface";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new AppError(httpsStatus.BAD_REQUEST, "User does not exist");
//   }

//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(
//       httpsStatus.UNAUTHORIZED,
//       "Email or password is incorrect"
//     );
//   }

//   const userTokens = createUserTokens(isUserExist);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: pass, ...rest } = isUserExist.toObject(); // password not send to frontend with response

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

// get new access token using refresh token

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

// resetPassword
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpsStatus.UNAUTHORIZED, "Old Password does not match");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user!.save();
};

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
};

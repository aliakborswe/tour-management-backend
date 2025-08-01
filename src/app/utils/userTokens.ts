import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";


export const createUserTokens = (user: Partial<IUser>) => {
      const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };
      const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES_IN
      );
    
      const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRES_IN
      );

      return{
        accessToken,
        refreshToken
      }
}
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpsStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { IUser } from "../user/user.interface";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


const credentialsLogin = async (payload : Partial<IUser>) =>{
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(httpsStatus.NOT_FOUND, "Email or password is incorrect");
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string);
    if( !isPasswordMatched) {
        throw new AppError(httpsStatus.UNAUTHORIZED, "Email or password is incorrect");
    }

    // user -> login -> token (email, role, id) --- booking / payment / booking cancel / payment cancel
    const jwtPayload = {
        userId : isUserExist._id,
        email : isUserExist.email,
        role : isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES_IN);

    return {
        accessToken
    }

}


export const AuthServices = {
    credentialsLogin,
};
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const generateAccessToken = (user: Object) => {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:"15m"})
};

export const generateRefreshToken = (user: Object) => {
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET as string,{expiresIn: '7d'})
}

export const generatePasswordResetToken = (user: Object) => {
    return jwt.sign(user,process.env.RESET_TOKEN_SECRET as string, {expiresIn: "20m"})
}
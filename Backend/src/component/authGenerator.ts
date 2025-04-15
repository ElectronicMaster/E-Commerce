import { Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export const newAccessToken = (req:Request,res:Response) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        res.status(403).send({
            status: false,
            message: "Refresh token invalid or expired"
        })
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null,user: JwtPayload | string | undefined) => {
        if(err) {
                res.status(403).send({
                status: false,
                message:  "Refresh token is invalid"
            })
            return;
        }

        const newAccessToken = jwt.sign(user as JwtPayload, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"})

        res.send({
            status: true,
            newAccessToken: newAccessToken,
            message: "new accesss token generated!!!"
        })
        return;
    })
}
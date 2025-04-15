import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";

interface CustomRequest extends Request{
    user?: any;
}

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const accessToken = req.header("Authorization");

    if(!accessToken) return res.status(401).json({status: false, token: false, message: "Access Token not found!!!"});

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if(err) return res.status(403).send({message: 'Token expired or invalid'});
        req.user = user;
        next()
    })       
};
import { Request,Response,NextFunction } from "express";
import { UserLoginSchema, UserSignUpSchema } from "../types/userSchema";

export const signupValidationUser = (req: Request,res: Response,next: NextFunction) => {
    const value = req.body;

    const validationResult = UserSignUpSchema.safeParse(value);

    if(!validationResult.success){
        res.status(400).send({
            status:false,
            message: validationResult.error.format()
        })
        return;
    }

    req.body = validationResult.data;
    next();
}

export const loginValidationUser = (req: Request, res: Response, next: NextFunction) => {
    const value = req.body;

    const validationResult = UserLoginSchema.safeParse(value);

    if(!validationResult.success){
        res.status(400).send({
            status: false,
            message: validationResult.error.format()
        })
        return;
    }

    req.body = validationResult.data;
    next();
}
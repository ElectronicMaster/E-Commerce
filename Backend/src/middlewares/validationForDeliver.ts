import { Request,Response,NextFunction } from "express";
import { DeliverLoginSchema, DeliverSignupSchema } from "../types/deliverSchema";

export const signupValidationDeliver = (req: Request,res: Response,next: NextFunction) => {
    const value = req.body;

    const validationResult = DeliverSignupSchema.safeParse(value);

    if(!validationResult.success){
        res.status(400).send({
            status: false,
            messsage: validationResult.error.format()
        })
        return;
    }

    console.log(validationResult.data)
    req.body = validationResult.data;
    next();
}

export const loginValidationDeliver = (req: Request,res: Response,next: NextFunction) => {
    const value = req.body;

    const valueValidation = DeliverLoginSchema.safeParse(value);

    if(!valueValidation.success){
        res.status(400).send({
            status: false,
            message: valueValidation.error.format()
        })
        return;
    }

    req.body = valueValidation.data;
    next();
}
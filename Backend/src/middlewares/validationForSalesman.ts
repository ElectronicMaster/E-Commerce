import { Request,Response,NextFunction } from "express";
import { SalesmanLoginSchema, SalesmanSignupSchema } from "../types/salesmanSchema";

export const signupValidationSalesman = (req: Request,res: Response,next: NextFunction) => {
    const value = req.body;

    const validationResult = SalesmanSignupSchema.safeParse(value);

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

export const loginValidationSalesman = (req: Request,res: Response,next: NextFunction) => {
    const value = req.body;

    const validationResult = SalesmanLoginSchema.safeParse(value);
        
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
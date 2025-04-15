import nodemailer from "nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request,Response } from "express";
import dotenv from "dotenv";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

dotenv.config()

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const sendResetEmail = async (email: string,id: string) => {
    try{
        const resetToken = jwt.sign({id: id,email: email},process.env.RESET_TOKEN_SECRET as string, {expiresIn: '1h'});

        const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.RESET_EMAIL,
                pass: process.env.RESET_PASSWORD
            }
        })

        const mailOptions = {
            form: process.env.EMAIL,
            to: email,
            subject: 'Passsword Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetURL}`
        }

        await transporter.sendMail(mailOptions);
    }catch(err){
        throw new Error('Unable to send reset email')
    }
}

export const forgotPassword = async (req:Request,res:Response) => {
    const {email,userType} = req.body();

    let tableName = "";

    switch (userType) {
        case "user":
            tableName = "user_details_table";
            break;
        case "salesman":
            tableName = "salesman_details_table";
            break;
        case "delivery":
            tableName = "deliver_details_table";
            break;
        default:
            res.status(400).send({
                status: false,
                message: "Invalid user type!"
            });
            return;
    }

    if(!validateEmail(email)){
        res.status(400).send({
            status: false,
            message: "Invalid email format!!!"
        })
    }

    const [result] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${tableName} WHERE email = ${email}`);

    if(!result.length){
        res.status(404).send({
            status: false,
            message: "User not found!!! check email or if new user sign up"
        })
    }

    try{
        await sendResetEmail(email,result[0].id);
        res.status(200).send({
            status: true,
            message: "Email sent succesfully!!! check your mail and use link to reset password..."
        })
    }catch(err){
        res.status(500).send({
            status: false,
            message: "server error try again later"
        })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const value = req.body;

    if(value.newpassword != value.confirmPassword){
        res.status(400).send({
            status: false,
            message: "new password and confirm password does not match"
        })
    }

    const authKey = req.headers.authorization || "";
    const decoded = jwt.verify(authKey,process.env.RESET_TOKEN_SECRET || "")

    let tableName = "";

    switch (value.userTypes) {
        case "user":
            tableName = "user_details_table";
            break;
        case "salesman":
            tableName = "salesman_details_table";
            break;
        case "delivery":
            tableName = "deliver_details_table";
            break;
        default:
            res.status(400).send({
                status: false,
                message: "Invalid user type!"
            });
            return;
    }

    const [result] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${tableName} WHERE id=${(decoded as JwtPayload).id}`)

    if(!result.length){
        res.status(400).send({
            status: false,
            message: "User ID does not exist"
        })
        return;
    }

    
}
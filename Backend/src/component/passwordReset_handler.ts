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

const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

const sendResetEmail = async (email: string,id: string,userType: string) => {
    try{
        const resetToken = jwt.sign({id: id,email: email,userType: userType},process.env.RESET_TOKEN_SECRET as string, {expiresIn: '1h'});

        const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.RESET_EMAIL,
                pass: process.env.RESET_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.RESET_EMAIL,
            to: email,
            subject: 'Passsword Reset Request',
            text: `Click the link to reset your password: ${resetURL}`,
            html: `
                <div>
                    <p>Hello,</p>
                    <p>You requested a password reset.</p>
                    <p><a href="${resetURL}">Click here to reset your password</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        }
        
        await transporter.verify();
        await transporter.sendMail(mailOptions);

    }catch(err){
        throw new Error(`Unable to send reset email \nERROR:: ${err}`)
    }
}

export const forgotPassword = async (req:Request,res:Response) => {
    const {email,userType} = req.body;

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
        return;
    }

    const [result] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${tableName} WHERE email = '${email}'`);

    if(!result.length){
        res.status(404).send({
            status: false,
            message: "User not found!!! check email or if new user sign up"
        })
        return;
    }

    try{
        await sendResetEmail(email,result[0].id,userType);
        res.status(200).send({
            status: true,
            message: "Email sent succesfully!!! check your mail and use link to reset password..."
        })
        return;
    }catch(err){
        res.status(500).send({
            status: false,
            message: "server error try again later"
        })
        return;
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const value = req.body;
    const authKey = req.headers.authorization || "";
    if(!authKey){
        res.status(401).send({
            status: false,
            message: "Unauthorzied: Token is missing"
        })
        return;
    }

    let decoded:JwtPayload = {}
    try{
        decoded = jwt.verify(authKey,process.env.RESET_TOKEN_SECRET || "") as JwtPayload;

        if(typeof(decoded) === 'string'){
            res.status(401).send({
                status: false,
                message: "Unauthorzied: Token is missing"
            })
            return;
        }
    }catch(err){
        res.status(403).send({
            status: false,
            message: "Forbidden: Token is expired"
        })
        return;
    }

    if(!validatePassword(value.new_password)){
        res.status(400).send({
            status: false,
            message: "Password must contain 1 upper case letter, 1 lower case letter, 1 special symbol and must be more than 8 characters"
        })
        return;
    }

    if(value.new_password != value.confirm_password){
        res.status(400).send({
            status: false,
            message: "new password and confirm password does not match"
        })
        return;
    }

    let tableName = "";

    switch (decoded.userType) {
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

    let sql = ``;
    try{
        sql = `SELECT * FROM ${tableName} WHERE id = ? AND email = ?`
        const [result] = await pool.execute<RowDataPacket[]>(sql,[(decoded as JwtPayload).id,(decoded as JwtPayload).email])
    
        if(!result.length){
            res.status(400).send({
                status: false,
                message: "User ID does not exist"
            })
            return;
        }

        const hash_password = await bcrypt.hash(value.new_password,10)

        sql = `UPDATE ${tableName} SET password_hash = ? WHERE id = ? AND email = ?`;
        await pool.execute(sql,[hash_password,(decoded as JwtPayload).id,(decoded as JwtPayload).email])

        res.status(200).send({
            status: true,
            message: "Password changes succesfully!!!"
        })
        return;
    }catch(err){
        res.status(500).send({
            status: false,
            message: "Server Error Please try again later!!!",
            error: err
        })
        return;
    }    
}
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import { Request,Response } from "express";
import pool from "../config/db";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { v4 as uuidv4 } from "uuid";

dotenv.config()

export const userSignUp = async (req:Request,res:Response) => {
    const value = req.body;

    try{
        const [result] = await pool.query<RowDataPacket[]>("SELECT * FROM user_details_table WHERE email = ?",[value.email]);

        if(result.length != 0){
            res.status(409).send({
                status: false,
                message: "User already exist... Please try to LOGIN..."
            })
            return;
        }

        const newUUID = uuidv4();
        
        if(value.password != value.confirm_password){
            res.status(400).send({
                status: false,
                message: "Password and Confirm Password does is not same"
            })
            return;
        }  

        const hashedPassword = await bcrypt.hash(value.password, 10);

        const dataToBeAdded = [newUUID,value.first_name, value.middle_name || null, value.last_name, value.email, hashedPassword, value.phone_no, value.home_address, value.street, value.state, value.city, value.pin_code]

        const query = `INSERT INTO user_details_table (id,first_name, middle_name, last_name, email, password_hash, phone_no, home_address, street, state, city, pin_code) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        await pool.execute(query, dataToBeAdded);

        res.status(200).send({
            status: true,
            message: "User Successfully Added!!!"
        })
        return;
    }catch(err){
        res.status(500).send({
            status: false,
            message: "Server Error",
            error: err
        })
        console.log("hello")
        return;
    }
}

export const userLogin = async (req: Request,res: Response) => {
    const value = req.body;

    try{
        const [result]= await pool.query<RowDataPacket[]>("SELECT * FROM user_details_table WHERE email = ?",[value.email]);

        if(!result.length){
            res.status(400).send({
                status: false,
                message: "User does not exist please try to signup or check your email address..."
            })
            return;
        }else{
            const isPasswordCorrect = await bcrypt.compare(value.password, result[0].password_hash);

            if(!isPasswordCorrect){
                res.status(400).send({
                    status: false,
                    message: "Password is incorrect..."
                })
                return;
            }
        }
        
        const payload = {userID: result[0].id, name: result[0].name, email: result[0].email}
        const refreshToken = generateRefreshToken(payload)
        const accessToken = generateAccessToken(payload)

        await pool.query("DELETE FROM user_refresh_tokens WHERE id = ?", [result[0].id]);
        await pool.query("INSERT INTO user_refresh_tokens (id, token) VALUES (?, ?)", [result[0].id, refreshToken]);


        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true, sameSite: 'strict'})

        res.status(200).send({
            status: true,
            message: "Login Success...",
            details: result,
            accessToken: accessToken
        })
        return;
    }catch(err){
        res.status(500).send({
            status: false,
            message: "Server Error",
            error: err
        })
        return;
    }
}
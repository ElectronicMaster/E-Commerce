import { Request,Response } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { v4 as uuidv4 } from "uuid";

export const deliverSignup = async(req:Request, res:Response) => {
    const value = req.body;

    try{
        const [result] = await pool.query<RowDataPacket[]>("SELECT * FROM deliver_details_table WHERE email = ?",[value.email]);

        if(result.length){
            res.status(409).send({
                status:false,
                message:"User already exist... Please try to LOGIN..."
            })
            return;
        }

        if(value.password != value.confirm_password){
            res.status(400).send({
                status:false,
                message:"Password and Confirm Password does not match"
            })
        }
        
        const uuid = uuidv4() 
        const hashedPassword = await bcrypt.hash(value.password,10);

        const dataToBeAdded = [uuid,`${value.first_name} ${value.middle_name} ${value.last_name}`,value.email,hashedPassword,value.phone_no,value.vehicle_number,value.vehicle_type,value.assigned_area];
        console.log(dataToBeAdded)
        const query = `INSERT INTO deliver_details_table (id,deliver_name,email,password_hash,phone,vehicle_number,vehicle_type,assigned_area) VALUES (?,?,?,?,?,?,?,?)`
        
        await pool.execute(query,dataToBeAdded)

        res.send(200).send({
            status: true,
            message: "User Successfully Added!!!"
        })
    }catch(err){
        res.status(500).send({
            status: false,
            message: "Server Error",
            error: err
        })
        return;
    }
}

export const deliverLogin = async (req:Request,res:Response) => {
    const value = req.body;

    try{
        const [result] = await pool.query<RowDataPacket[]>("SELECT * FROM deliver_details_table WHERE email = ?", [value.email]);

        if(!result.length){
            res.status(400).send({
                status: false,
                message: "User does not exist please Signup or Check your Login email"
            })
            return;
        }

        const payload = {deliver_ID: result[0].deliver_id, name: result[0].name, email: result[0].email}

        const refreshToken = generateRefreshToken(payload);
        const accessToken = generateAccessToken(payload);

        await pool.query("INSERT INTO deliver_refresh_tokens (id, token) VALUES (?,?)", [result[0].id,refreshToken])

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
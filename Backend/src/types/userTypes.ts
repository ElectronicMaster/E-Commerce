import { RowDataPacket } from "mysql2";
import {z} from "zod";

interface User extends RowDataPacket{
    user_id: string,
    first_name: string,
    last_name: string,
    email: string,
    password_hash: string,
    phone_no: number,
    home_address: string,
    street:string,
    city_state: string,
    country: string,
    created_at: string,
    updated_at: string,
}

export default User;
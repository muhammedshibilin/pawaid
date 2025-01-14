import { Document } from "mongoose";

export interface IDoctor extends Document{
    username:string;
    email:string;
    phone:number;
    document:string;
    password?:string|null;
    is_block?:boolean;
    is_verified?:boolean;
    rescued?:number;
    is_available?:boolean
}
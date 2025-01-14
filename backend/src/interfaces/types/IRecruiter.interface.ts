import { Document } from "mongoose";

export interface IRecruiter extends Document{
    username:string;
    email:string;
    phone:number;
    document:Document;
    password?:string|null;
    is_block?:boolean;
    is_verified?:boolean;
    rescued?:number;
    is_available?:boolean
}
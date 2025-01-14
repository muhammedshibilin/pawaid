import { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    phone?: number;
    rescued?:number;
    is_block?: boolean; 
    is_verified?: boolean; 
    is_admin?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
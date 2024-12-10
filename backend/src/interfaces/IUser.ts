import { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    phone:number;
    is_block?: boolean; 
    is_verified?: boolean; 
    createdAt?: Date;
    updatedAt?: Date;
  }
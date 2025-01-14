import mongoose, { Document } from 'mongoose';

export interface IOtp extends Document {
  userId: mongoose.Types.ObjectId; 
  otp: string;
  expiresIn: Date;
}
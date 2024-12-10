import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../interfaces/IUser';


const UserSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone:{
      type:Number,
      required:true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    is_block:{
      type:Boolean,
      default:false
    },
    is_verified:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true, 
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

import mongoose, { Schema,Model } from 'mongoose';
import { IUser } from '../interfaces/types/IUser';


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
    phone: {
      type: Number,
    },
    password: {
      type: String,
      minlength: 6,
    },
    is_block: {
      type: Boolean,
      default: false
    },
    is_admin: {
      type: Boolean,
      default: false
    },
    rescued:{
      type:Number,
      default:0
    },
    is_verified: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

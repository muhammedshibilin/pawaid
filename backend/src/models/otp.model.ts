import mongoose, { Schema } from 'mongoose';
import { IOtp } from '../interfaces/types/IOtp';

const otpSchema = new Schema<IOtp>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    expiresIn: { type: Date, required: true },
});


otpSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 });

export const otpModel = mongoose.model<IOtp>('otp', otpSchema);

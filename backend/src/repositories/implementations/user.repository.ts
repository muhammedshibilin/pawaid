import { IOtp } from "../../interfaces/types/IOtp";
import { IUser } from "../../interfaces/types/IUser";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { otpModel } from "../../models/otp.model";
import User from "../../models/user.model";
import { IDoctor } from "../../interfaces/types/IDocotor.interface";
import { IRecruiter } from "../../interfaces/types/IRecruiter.interface";
import Doctor from "../../models/doctor.model";
import Recruiter from "../../models/recruiter.model";


class UserRepository implements IUserRepository {
    async create(userData: IUser): Promise<IUser> {
        const newUser = new User(userData);
        try {
            return await newUser.save();
        } catch (error) {
            console.error("Error saving user to MongoDB:", error);
            throw error;
        }
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await User.findOne({ _id: userId });
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email, is_block: false }); 
    }
    

    async updatePassword(id: string, hashedPassword: string): Promise<IUser | null> {
        return await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );
    }

    async saveOtp(userId: string, otp: string): Promise<IOtp> {
        const expiresIn = new Date();
        expiresIn.setMinutes(expiresIn.getMinutes() + 1);

        return await otpModel.create({
            userId,
            otp,
            expiresIn,
        });
    }



    async verifyOtp(userId: string, otp: string): Promise<boolean> {
        const otpEntry = await otpModel.findOne({ userId, otp });
        if (!otpEntry) return false;

        const isExpired = otpEntry.expiresIn < new Date();
        if (isExpired) {
            await otpEntry.deleteOne();
            return false;
        }

        await otpEntry.deleteOne();
        return true;
    }

    async updateUserVerificationStatus(userId: string, isVerified: boolean): Promise<void> {
        await User.updateOne({ _id: userId }, { $set: { is_verified: isVerified } });
    }

    async createGoogleUser(user: { email: string; username: string }): Promise<IUser | null> {
        const newUser = new User({
            ...user,
            is_verified: true, 
            is_block: false,
            is_admin: false
        });
        return await newUser.save();
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async updateUserTokens(userId: string, refreshToken: string): Promise<void> {
        const updateData = {
            refresh_token: refreshToken,
            last_login: new Date(),
            is_verified: true, 
            $setOnInsert: {  
                is_block: false,
                is_admin: false
            }
        };

        await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            upsert: true, 
            setDefaultsOnInsert: true
        });
    }


}

export default UserRepository;

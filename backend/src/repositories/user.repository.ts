import { IUser } from "../interfaces/IUser";
import User from "../models/user.model";
 
class UserRepository{
    constructor(){}



    async createUser(userData:IUser):Promise<IUser>{
        const newUser = new User(userData)
        try {
            return await newUser.save();
        } catch (error) {
            console.error("Error saving user to MongoDB:", error);
            throw error
        }
    }

    async findByEmail(email:string):Promise<IUser|null>{
        return await User.findOne({email})
    }

    async updatePassword(id:string,hashedPassword:string):Promise<IUser | null>{
        return await User.findByIdAndUpdate(id,{password:hashedPassword},{new:true  })
    }
}

export default new UserRepository()
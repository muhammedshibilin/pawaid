import userService from '../services/user.service';
import { Request, Response } from "express";
import { IUser } from '../interfaces/IUser';


class UserController {

    async register(req:Request,res:Response):Promise<Response>{
        const {username,email,password,phone} = req.body
        try {
            const serviceResponse = await userService.registerUser({username,email,password,phone} as IUser)
            if(serviceResponse.status===400){
                return res.status(400).json({
                    message:serviceResponse.message
                })
            }
            return res.status(serviceResponse.status).json({
                message:serviceResponse.message,
                data:serviceResponse.data
            })
            
        } catch (error) {
            return res.status(400).json({
                message:(error as Error).message || 'an error occurred while registering the user'
            })
        }
    }

    async login(req:Request,res:Response):Promise<Response>{
        const {email,password} = req.body
        try {
            const {status,message,token} = await userService.loginUser(email,password)
            if (status === 200) {
                return res.status(status).json({ message, token });
            }
            return res.status(status).json({ message });
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while logging in' });

        }
    }

    async requestPasswordReset(req:Request,res:Response):Promise<Response>{
        const { email } = req.body;
    const response = await userService.requestPasswordReset(email);
    return res.status(response.status).json({ message: response.message });
    }

    async resetPassword(req: Request, res: Response):Promise<Response>{
        console.log(req.body)
        const { token, newPassword } = req.body;
        const response = await userService.resetPassword(token, newPassword);
        return res.status(response.status).json({ message: response.message });
      }
}

export default new UserController()
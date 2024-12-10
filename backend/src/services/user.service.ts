import { IUser } from "../interfaces/IUser";
import userRepository from "../repositories/user.repository";
import { sendEmail } from "../utilities/mailsender.utility";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class UserService {
    async registerUser(userData: IUser): Promise<{ status: number; message: string; data?: IUser }> {
        try {

            const existingUserEmail = await userRepository.findByEmail(userData.email);
            if (existingUserEmail) {
                console.log("email already")
                return {
                    status: 400,
                    message: 'Email already in use',
                };
            }


            const hashedPassword = await bcryptjs.hash(userData.password, 10);
            console.log(" in service layer");


            const newUser = await userRepository.createUser({
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                phone: Number(userData.phone),
            } as IUser);

            return {
                status: 200,
                message: 'User registered successfully',
                data: newUser,
            };
        } catch (error) {
            console.error("Error in UserService", error);
            return {
                status: 500,
                message: 'Unexpected error occurred while registering the user',
            };
        }
    }

    async loginUser(email: string, password: string): Promise<{ status: number; message: string; token?: string;refreshToken?:string }> {
        try {
            const user = await userRepository.findByEmail(email)
            if (!user) {
                return { status: 404, message: 'User not found' };
            }
            const isValidPassword = await bcryptjs.compare(password, user.password)
            if (!isValidPassword) {
                return { status: 401, message: "incorrect password"}
            }

            const accessToken = jwt.sign(
                { id: user._id, email: user.email, role: 'user' },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' } 
            );
            const refreshToken = jwt.sign(
                { id: user._id, email: user.email, role: 'user' },
                process.env.JWT_REFRESH_SECRET as string,
                { expiresIn: '14d' } 
            );

            return { status: 200, message: 'Login successful', token:accessToken,refreshToken};
        } catch (error) {
            console.error('Error during login:', error);
            return { status: 500, message: 'Unexpected error occurred during login' };
        }
    }

    async requestPasswordReset(email: string): Promise<{ status: number; message: string }> {
        const user = await userRepository.findByEmail(email);
        if (!user) return { status: 404, message: 'User not found' };
    
        const resetToken = jwt.sign(
          { id: user.id, email: user.email,role:'user'},
          process.env.JWT_RESET_SECRET!,
          { expiresIn: '15m' } 
        );
        const html = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Please fill out the form below to reset it:</p>
            <form method="POST" action="http://localhost:4040/reset-password">
              <input type="hidden" name="token" value="${resetToken}" />
              <label for="newPassword">New Password:</label>
              <br />
              <input type="password" id="newPassword" name="newPassword" required style="margin-bottom: 10px; padding: 8px; width: 100%; max-width: 300px;" />
              <br />
              <label for="confirmPassword">Confirm Password:</label>
              <br />
              <input type="password" id="confirmPassword" name="confirmPassword" required style="margin-bottom: 10px; padding: 8px; width: 100%; max-width: 300px;" />
              <br />
              <button type="submit" style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; cursor: pointer;">Reset Password</button>
            </form>
            <p>If you did not request this, you can safely ignore this email.</p>
          </body>
        </html>
      `;

        sendEmail(user.email,"for resetting the password",html)

        return { status: 200, message: 'Password reset email sent' };
      }

    async resetPassword(token: string, newPassword: string): Promise<{ status: number; message: string }> {
        try {
          const decoded: any = jwt.verify(token, process.env.JWT_RESET_SECRET!);
          const user = await userRepository.findByEmail(decoded.email);
    
          if (!user) {
            return { status: 404, message: 'User not found' };
          }
    
          const hashedPassword = await bcryptjs.hash(newPassword, 10);
          await userRepository.updatePassword(user.id, hashedPassword);
    
          return { status: 200, message: 'Password reset successfully' };
        } catch (error) {
          return { status: 400, message: 'Invalid or expired token' };
        }
      }
}

export default new UserService();

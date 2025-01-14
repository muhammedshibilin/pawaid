import { IUser } from "../interfaces/types/IUser";
import { sendEmail } from "../utilities/mailsender.utility";
import { sendOtp } from "../config/twilio.config"
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator'
import dotenv from 'dotenv';
import { generateJwtToken } from "../utilities/generateJwt";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
dotenv.config();

class UserService {

  constructor(private userRepository: IUserRepository) {
  }
  async registerUser(userData: IUser): Promise<{ status: number; message: string; data?: IUser }> {
    console.log("haidd the register call in user service with data", userData)
    try {
      console.log("in serviceee", userData)
      const existingUserEmail = await this.userRepository.findByEmail(userData.email);
      if (existingUserEmail) {
        console.log("email already")
        return {
          status: 400,
          message: 'Email already in use',
        };
      }

      let hashedPassword = null;
      if (userData.password) {
        hashedPassword = await bcryptjs.hash(userData.password, 10);
      }



      const newUser = await this.userRepository.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone ? Number(userData.phone) : undefined,
      } as IUser);

      if (newUser.phone) {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        console.log("generated OTP:", otp);

        await this.userRepository.saveOtp(newUser._id as string, otp);
        await sendOtp(newUser.phone.toString(), otp);
      }

      return {
        status: 200,
        message: 'User registered successfully',
        data: newUser
      };
    } catch (error) {
      console.error("Error in UserService", error);
      return {
        status: 500,
        message: 'Unexpected error occurred while registering the user',
      };
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await this.userRepository.findUserById(userId)
  }
  

  async verifyUserOtp(userId: string, otp: string): Promise<{ status: number; message: string, token?: string, refreshToken?: string }> {
    try {
      const isVerified = await this.userRepository.verifyOtp(userId, otp);
      if (!isVerified) {
        return {
          status: 400,
          message: 'Invalid or expired OTP',
        };
      }
      await this.userRepository.updateUserVerificationStatus(userId, true);

      const user = await this.userRepository.findUserById(userId)

      if (!user) {
        return { status: 404, message: 'User not found' };
      }


      const accessToken = generateJwtToken(
        { id: user._id, email: user.email, role: 'user' },
        'access',
        '5m'
      );

      const refreshToken = generateJwtToken(
        { id: user._id, email: user.email, role: 'user' },
        'refresh',
        '14d'
      );
      return {
        status: 200,
        message: 'OTP verified successfully, user is now verified',
        token: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      console.error("Error updating user verification status:", error);
      return {
        status: 500,
        message: 'Failed to update user verification status',
      };
    }
  }

  async resendOtp(userid: string): Promise<{ status: number, message: string }> {
    console.log('serviceilll user id for resend', userid)
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    console.log(otp)

    await this.userRepository.saveOtp(userid as string, otp);
    const user = await this.userRepository.findUserById(userid)
    console.log('serviceilee resend user', user!.phone)
    if (!user) {
      return { status: 401, message: 'user not found' }
    }
    if (!user.phone) {
      throw new Error('Password is missing for this user.');
    }


    await sendOtp(user.phone.toString(), otp)
    return { status: 200, message: 'resend otp sent successfully' }
  }

  async registerGoogleUser(user: { email: string; username: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    try {
      let existingUser = await this.userRepository.findUserByEmail(user.email);
      console.log(existingUser,'haiii i am existign')
      
      if (existingUser) {
        console.log('user is existing ',existingUser)
        const { accessToken, refreshToken } = this.generateTokens(existingUser);
        
        return {
          user: existingUser,
          accessToken,
          refreshToken
        };
      }

      const createdUser = await this.userRepository.createGoogleUser(user);
      if (!createdUser) {
        throw new Error('Failed to create user');
      }

      const { accessToken, refreshToken } = this.generateTokens(createdUser);

      return {
        user: createdUser,
        accessToken,
        refreshToken
      };
    } catch (error) {
      console.error('Error in registerGoogleUser:', error);
      throw error;
    }
  }

  async verifyEmail(email: string): Promise<{ user: IUser | null; accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        return { user: null, accessToken: '', refreshToken: '' };
      }

      const { accessToken, refreshToken } = this.generateTokens(user);

      return { 
        user, 
        accessToken, 
        refreshToken 
      };
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      throw error;
    }
  }

  // Helper method to generate tokens
  private generateTokens(user: IUser) {
    const accessToken = generateJwtToken(
      { id: user._id, email: user.email, role: 'user' },
      'access',
      '15m'
    );

    const refreshToken = generateJwtToken(
      { id: user._id, email: user.email, role: 'user' },
      'refresh',
      '7d'
    );

    return { accessToken, refreshToken };
  }

  async loginUser(email: string, password: string): Promise<{ status: number; message: string; token?: string; refreshToken?: string, data?: IUser }> {
    console.log('login service is called with', email, password);

    try {
      const user = await this.userRepository.findByEmail(email);
      console.log('user found:', user);

      if (!user) {
        return { status: 404, message: 'User not found' };
      }

      if (!user.password) {
        throw new Error('Password is missing for this user.');
      }

      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return { status: 401, message: 'Incorrect password' };
      }
      if (user.is_verified === false) {
        console.log('User is not verified');

        if (user.phone) {
          const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
          console.log("Generated OTP:", otp);
          await this.userRepository.saveOtp(user._id!.toString(), otp);
          await sendOtp(user.phone.toString(), otp);

          return { status: 201, message: 'User not verified', data: user };
        } else {
          return { status: 400, message: 'User is not verified and phone number is missing' };
        }
      }

      const accessToken = generateJwtToken(
        { id: user._id, email: user.email, role: 'user' },
        'access',
        '2m'
      );

      const refreshToken = generateJwtToken(
        { id: user._id, email: user.email, role: 'user' },
        'refresh',
        '14d'
      );

      return { status: 200, message: 'Login successful', token: accessToken, refreshToken };

    } catch (error) {
      console.error('Error during login:', error);
      return { status: 500, message: 'Unexpected error occurred during login' };
    }
  }

  async requestPasswordReset(email: string): Promise<{ status: number; message: string }> {
    const user = await this.userRepository.findByEmail(email);
    console.log('userrr in passwrod change', user)
    if (!user) return { status: 404, message: 'User not found' };

    const resetToken = jwt.sign(
      { id: user.id, email: user.email,role: 'user' },
      process.env.JWT_RESET_SECRET!,
      { expiresIn: '15m' }
    );
    console.log('reset token',resetToken)
   const html = `<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password. Please enter your new password below:</p>
    
    <form method="POST" action="http://localhost:4040/reset-password" style="margin-top: 20px;">
      <input type="hidden" name="token" value="${resetToken}" />
      
      <label for="newPassword">New Password:</label>
      <br />
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        required
        style="margin-bottom: 10px; padding: 8px; width: 100%; max-width: 300px;"
      />
      <br />
      
      <label for="confirmPassword">Confirm Password:</label>
      <br />
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        required
        style="margin-bottom: 10px; padding: 8px; width: 100%; max-width: 300px;"
      />
      <br />
      
      <button
        type="submit"
        style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; cursor: pointer;"
      >
        Reset Password
      </button>
    </form>

    <p>If you did not request this, you can safely ignore this email.</p>
  </body>
</html>
`
  
    console.log(resetToken)
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html
    }); return { status: 200, message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ status: number; message: string }> {
    try {

      console.log('reset token in rsetpasswrd',token)
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET!) as jwt.JwtPayload;
            const user = await this.userRepository.findByEmail(decoded.email);
  
      if (!user) {
        return { status: 404, message: 'User not found' }; 
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
  
      await this.userRepository.updatePassword(user.id, hashedPassword);
  
      return { status: 200, message: 'Password reset successfully' };
    
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return { status: 400, message: 'Invalid token' };
      }
  
      if (error instanceof jwt.TokenExpiredError) {
        return { status: 400, message: 'Token expired' }; 
      }
  
      if (error instanceof Error && error.message.includes('database')) {
        return { status: 500, message: 'Database error, please try again later' }; 
      }
  
      console.error('Error resetting password:', error);
      return { status: 500, message: 'Internal server error, please try again later' }; 
    }
  }

  async getProfile(userId: string) {
    console.log("get profile service", userId)
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }



}

export default UserService;

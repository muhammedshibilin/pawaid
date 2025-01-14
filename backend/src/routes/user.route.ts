import { Router } from "express";
import refreshAccessToken from "../middlewares/refreshtoken";
import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import UserRepository from "../repositories/implementations/user.repository";
import authenticateJWT from '../middlewares/authentication';
import {logout} from "../utilities/cookie.util";
import dotenv from 'dotenv';
dotenv.config();


const user_route = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

user_route.post("/register", userController.register.bind(userController));
user_route.post("/register-google-user",userController.registerGoogleUser.bind(userController))
user_route.post('/find-user', userController.findUser.bind(userController));
user_route.post('/login',userController.login.bind(userController))
user_route.post('/logout',authenticateJWT(['user','admin']),logout)
user_route.get('/refresh-token',refreshAccessToken);
user_route.post('/verify-email',userController.requestPasswordReset.bind(userController))
user_route.post('/reset-password',userController.resetPassword.bind(userController))
user_route.post('/verify-otp',userController.verifyOtp.bind(userController))
user_route.post('/resend-otp',userController.resendOtp.bind(userController))
user_route.get('/profile',authenticateJWT(['user','admin']),userController.getProfile.bind(userController))
user_route.post('/verifyGoogleEmail', userController.verifyEmail.bind(userController));




export default user_route;
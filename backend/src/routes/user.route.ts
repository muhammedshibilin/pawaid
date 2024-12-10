import { Router } from "express";
import userController from "../controllers/user.controller";
import refreshAccessToken from "../middlewares/refreshtoken";

const user_route = Router();

user_route.post("/register", userController.register);
user_route.post('/login',userController.login)
user_route.post('/refresh-token',refreshAccessToken)
user_route.post('/forget-password',userController.requestPasswordReset)
user_route.post('/reset-password',userController.resetPassword)

export default user_route;
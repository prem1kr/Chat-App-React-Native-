import express from "express";
import { getAllUser, Login, Logout, Signup, TotalUser, User } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post('/signup', Signup);
authRouter.post('/login', Login);
authRouter.get('/user', authMiddleware, User);
authRouter.post('/logout', Logout);
authRouter.get('/total-user', TotalUser);
authRouter.get('/all-users', getAllUser);

export default authRouter;

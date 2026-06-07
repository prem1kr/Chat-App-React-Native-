import express from "express";
import { getAllUser, Login, Logout, Signup, TotalUser, User, UserI } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post('/signup', Signup);
authRouter.post('/login', Login);
authRouter.get('/user', authMiddleware, User);
authRouter.get('/user-id/:userId', UserI);
authRouter.post('/logout', Logout);
authRouter.get('/total-user', TotalUser);
authRouter.get('/all-users', getAllUser);

export default authRouter;

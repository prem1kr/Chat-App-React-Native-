import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrGetChat, getAllChat, getChatById, getUserChats } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/create", authMiddleware, createOrGetChat);
chatRouter.get("/list", authMiddleware, getUserChats);
chatRouter.get("/:chatId", authMiddleware, getChatById);
chatRouter.get("/getAllChats",authMiddleware,getAllChat);

export default chatRouter;
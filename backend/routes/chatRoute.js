import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrGetChat, getAllChat, getChatById, getUserChats } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/create", authMiddleware, createOrGetChat);
chatRouter.get("/list", authMiddleware, getUserChats);
chatRouter.get("/getAllChats", authMiddleware, getAllChat);
chatRouter.get("/:chatId", authMiddleware, getChatById);

export default chatRouter;
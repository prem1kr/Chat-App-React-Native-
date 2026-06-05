import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteMessage, getChatMessages, getGroupMessages, markAsDelivered, markAsRead, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/send", authMiddleware, sendMessage);
messageRouter.get("/chat/:chatId", authMiddleware, getChatMessages);
messageRouter.get("/group/:groupId", authMiddleware, getGroupMessages);
messageRouter.put("/delivered/:messageId", authMiddleware, markAsDelivered);
messageRouter.put("/read/:messageId", authMiddleware, markAsRead);
messageRouter.delete("/:messageId", authMiddleware, deleteMessage);

export default messageRouter;
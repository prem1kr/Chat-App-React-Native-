import chatModel from "../models/chatModel.js";
import { io } from "../socket/socket.js";

export const createOrGetChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }

    let chat = await chatModel.findOne({ participants: { $all: [userId, receiverId] } });
    if (!chat) {
      chat = await chatModel.create({
        participants: [userId, receiverId],
        lastMessage: null,
        lastMessageTime: new Date(),
      });

      chat = await chatModel.findById(chat._id).populate("participants", "name email profilePic isOnline");

      const payload = { chat, type: "chat_created" };
      io.to(receiverId.toString()).emit("chatCreated", payload);
      io.to(userId.toString()).emit("chatCreated", payload);
      return res.status(201).json({ success: true, message: "Chat created successfully", chat });
    }

    chat = await chatModel.findById(chat._id).populate("participants", "name email profilePic isOnline");
    return res.status(200).json({ success: true, message: "Chat already exists", chat });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await chatModel.find({ participants: userId }).populate("participants", "name email profilePic isOnline").sort({ lastMessageTime: -1 });

    return res.status(200).json({ success: true, chats });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};


export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findById(chatId).populate("participants", "name email profilePic isOnline");
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    return res.status(200).json({ success: true, chat });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};



export const getAllChat = async (req, res) => {
  try {
    const chats = await chatModel.find().populate("participants", "name email profilePic isOnline").sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, chats });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
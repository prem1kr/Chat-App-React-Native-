import chatModel from "../models/chatModel.js";
import groupModel from "../models/groupModel.js";
import messageModel from "../models/messageModel.js";


export const sendMessage = async (req, res) => {
  try {
    const sender = req.user.id;

    const {
      chatId,
      groupId,
      text,
      messageType,
      mediaUrl,
    } = req.body;

    if (!chatId && !groupId) {
      return res.status(400).json({ success: false, message: "chatId or groupId is required" });
    }

    const message = await messageModel.create({
      sender,
      chatId: chatId || null,
      groupId: groupId || null,
      text,
      messageType: messageType || "text",
      mediaUrl,
      deliveredTo: [sender],
      readBy: [sender],
    });

    if (chatId) {
      await chatModel.findByIdAndUpdate(chatId, { lastMessage: text || messageType, lastMessageTime: new Date() });
    }

    if (groupId) {
      await groupModel.findByIdAndUpdate(groupId, { lastMessage: text || messageType, lastMessageTime: new Date() });
    }

    const populatedMessage = await messageModel.findById(message._id).populate("sender", "name profilePic");
    return res.status(201).json({ success: true, message: "Message sent successfully", data: populatedMessage });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });

  }
};


export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await messageModel.find({ chatId }).populate("sender", "name profilePic").sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });

  }
};


export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await messageModel.find({ groupId }).populate("sender", "name profilePic").sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });

  }
};


export const markAsDelivered = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await messageModel.findByIdAndUpdate(messageId,
      { $addToSet: { deliveredTo: userId } },
      { new: true }
    );

    return res.status(200).json({ success: true, message });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });

  }
};


export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await messageModel.findByIdAndUpdate(messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    return res.status(200).json({ success: true, message });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });

  }
};


export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await messageModel.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await messageModel.findByIdAndDelete(messageId);
    return res.status(200).json({ success: true, message: "Message deleted successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });

  }
};
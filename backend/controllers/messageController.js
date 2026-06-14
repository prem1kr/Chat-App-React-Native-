import chatModel from "../models/chatModel.js";
import groupModel from "../models/groupModel.js";
import messageModel from "../models/messageModel.js";
import { io } from "../socket/socket.js";

export const markAsDelivered = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await messageModel.findByIdAndUpdate(messageId,
      { $addToSet: { deliveredTo: userId } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

   io.to(message.sender.toString()).emit("messageDelivered", {messageId,userId});

    if (message.groupId) {
      const group = await groupModel.findById(message.groupId);
      group.members.forEach((memberId) => {
        io.to(memberId.toString()).emit("groupMessageDelivered", {messageId,userId});
      });
    }
    
    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

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

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    io.to(message.sender.toString()).emit("messageRead", { messageId, userId });

    if (message.groupId) {
      const group = await groupModel.findById(message.groupId);
      group.members.forEach((memberId) => {
        io.to(memberId.toString()).emit("groupMessageRead", { messageId, userId });
      });
    }
    
    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};


export const sendMessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const { chatId, groupId, text, messageType, mediaUrl } = req.body;

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

    const populatedMessage = await messageModel.findById(message._id).populate("sender", "name profilePic");
    const updateData = { lastMessage: text || messageType, lastMessageTime: new Date(), };
    if (chatId) {
      await chatModel.findByIdAndUpdate(chatId, updateData);
      const chat = await chatModel.findById(chatId);
      const receiverId = chat.participants.find((id) => id.toString() !== sender);
      io.to(receiverId.toString()).emit("newMessage", populatedMessage);
      io.to(sender.toString()).emit("messageSent", populatedMessage);
    }

    if (groupId) {
      await groupModel.findByIdAndUpdate(groupId, updateData);
      const group = await groupModel.findById(groupId);
      group.members.forEach((memberId) => { io.to(memberId.toString()).emit("groupMessage", populatedMessage); });
    }

    return res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await messageModel.find({ chatId }).populate("sender", "name profilePic").sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await messageModel.find({ groupId }).populate("sender", "name profilePic").sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
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

    if (message.chatId) {
      const latestMessage = await messageModel
        .findOne({ chatId: message.chatId })
        .sort({ createdAt: -1 });

      const payload = {
        messageId,
        chatId: message.chatId,
        lastMessage: latestMessage?.text || "",
        lastMessageTime: latestMessage?.createdAt || null,
      };

      await chatModel.findByIdAndUpdate(message.chatId, {
        lastMessage: payload.lastMessage,
        lastMessageTime: payload.lastMessageTime,
      });

      const chat = await chatModel.findById(message.chatId);
      const receiverId = chat.participants.find((id) => id.toString() !== userId);
      io.to(receiverId.toString()).emit("messageDeleted", payload);
      io.to(userId.toString()).emit("messageDeleted", payload);
    }


    if (message.groupId) {
      const latestMessage = await messageModel.findOne({ groupId: message.groupId }).sort({ createdAt: -1 });

      const payload = {
        messageId,
        groupId: message.groupId,
        lastMessage: latestMessage?.text || "",
        lastMessageTime: latestMessage?.createdAt || null,
      };

      await groupModel.findByIdAndUpdate(message.groupId, {
        lastMessage: payload.lastMessage,
        lastMessageTime: payload.lastMessageTime,
      });

      const group = await groupModel.findById(message.groupId);
      group.members.forEach((memberId) => { io.to(memberId.toString()).emit("groupMessageDeleted", payload) });
    }

    return res.status(200).json({ success: true, message: "Message deleted successfully", });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        default: null,
    },

    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
    },

    text: {
        type: String,
        default: "",
    },

    messageType: {
        type: String,
        enum: ["text", "image", "video", "audio", "file", "location"],
        default: "text",
    },

    mediaUrl: {
        type: String,
        default: "",
    },

    deliveredTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
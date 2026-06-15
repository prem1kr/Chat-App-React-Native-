import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true,
    },

    groupImage: {
        type: String,
        default: "",
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    lastMessage: {
        type: String,
        default: "",
    },

    lastMessageTime: {
        type: Date,
    },

    unreadCounts: {
        type: Map,
        of: Number,
        default: {},
    },

}, { timestamps: true });

export default mongoose.model("Group", groupSchema);
import mongoose from "mongoose";

const authSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    profilePic: {
        type: String,
        default: "",
    },

    isOnline: {
        type: Boolean,
        default: false,
    },

    lastActive: {
        type: Date,
        default: Date.now,
    },


}, { timestamps: true });

export default mongoose.model("User", authSchema);

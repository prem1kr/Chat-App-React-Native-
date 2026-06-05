import mongoose from "mongoose";

const authSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ["user", "admin"],
        default: 'user'
    },
    name: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },


}, { timestamps: true });

export default mongoose.model("User", authSchema);

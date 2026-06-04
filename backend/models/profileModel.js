import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        bio: {
            type: String,
            default: "",
            maxlength: 200,
        },

        profileImage: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
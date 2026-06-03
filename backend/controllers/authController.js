import authModel from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
    try {
        const { role, name, email, password } = req.body;
        const existingUser = await authModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await authModel.create({
            role,
            name,
            email,
            password: hashPassword,

        });

        return res.status(201).json({
            success: true, message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        if (role && role !== user.role) {
            return res.status(403).json({ success: false, message: `Access denied. You are registered as ${user.role}` });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true, message: "Login successful", token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const User = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await authModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User data fetched successfully", user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const TotalUser = async (req, res) => {
    try {
        const total = await authModel.countDocuments();
        return res.status(200).json({ success: true, message: "user count successfully fetched", total });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error", error: error.message });
    }
}


export const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'Logout Successful' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
    }
}


export const getAllUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User data fetched successfully", users });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


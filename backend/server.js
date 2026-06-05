import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from 'http';
import { Server } from "socket.io";
import ConnectMongoose from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileRoute.js";
import { initializeSocket } from "./socket/socket.js";
import chatRouter from "./routes/chatRoute.js";
import groupRouter from "./routes/groupRoute.js";
import messageRouter from "./routes/messageRoute.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

initializeSocket(io);


app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/chat', chatRouter);
app.use('/api/group', groupRouter);
app.use('/api/message', messageRouter);


server.listen(process.env.PORT || 5000, async () => {
    ConnectMongoose();
    console.log(` Server running on port ${process.env.PORT || 5000}`);
});


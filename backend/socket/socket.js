import authModel from "../models/authModel.js";

let io;

export const initializeSocket = (serverIo) => {
    io = serverIo;
    io.on("connection", (socket) => {
        console.log("user connected", socket.id);

        socket.on("join", async (userId) => {
            socket.userId = userId;
            await authModel.findByIdAndUpdate(userId,
                { isOnline: true }
            );
            socket.join(userId);
            console.log(`${userId} joined`);
        });

        socket.on("disconnect", async () => {
            if (socket.userId) {
                await authModel.findByIdAndUpdate(socket.userId,
                    {
                        isOnline: false,
                        lastActive: new Date()
                    }
                );
            }

            console.log("user disconnected", socket.id);
        });
    });
};

export {io};
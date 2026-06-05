
export const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("user connected", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`${userId} joined `);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });


    })
}
export const socketConnection = (io) => {

    io.on("connection", (socket) => {
        console.log("✅ User Connected:", socket.id);

        socket.on("send_message", (data) => {
            console.log("Message:", data);
            io.emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("❌ User Disconnected:", socket.id);
        });
    });

};
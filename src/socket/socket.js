exports.useSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User ${socket.id} connect`);

        socket.on("disconnect", () => {
            console.log(`User ${socket.id} disconnect`);
        });
    });
};

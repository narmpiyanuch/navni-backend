exports.useSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User ${socket.id} connect`);
    });
};

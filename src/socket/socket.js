const chalk = require("chalk");
const createError = require("../utils/createError");
const prisma = require("../model/prisma");

const onlineDriver = [];

// exports.testIoMiddleWare = (io) => {
//     io.use((socket, next) => {
//         if (socket.handshake.auth.user.role === "USER") {
//             const driverId = socket.handshake.auth.user.id;

//             if (!driverId) {
//                 console.log(chalk.red("error connect"));
//                 return next(createError("invalid username"));
//             }
//             socket.driver = socket.handshake.auth.user;

//             onlineDriver.push({
//                 driverId: socket.driverId,
//                 socketId: socket.id,
//             });
//             console.log(
//                 chalk.greenBright(
//                     `online : ${Object.keys(onlineDriver).length}`
//                 )
//             );
//             console.log(chalk.greenBright(`Driver connected ${socket.id}`));
//         }
//         next();
//     });
// };

exports.useSocket = (io) => {
    io.use((socket, next) => {
        console.log(socket.handshake.auth);
        // if (socket.handshake.auth.user.role === "USER") {
        const userId = socket.handshake.auth.user.id;

        if (!userId) {
            console.log("error connect");
            return next(createError("invalid username"));
        }

        socket.userId = socket.handshake.auth.user.id;
        socket.role = socket.handshake.auth.user.role;
        next();
    });

    io.on("connection", (socket) => {
        console.log("connected: " + socket.id);

        socket.on("join_room", async (data) => {
            if (socket.role === "USER") {
                // Check if the sender is a valid user
                const user = await prisma.user.findUnique({
                    where: { id: socket.userId, role: "USER" },
                });
                if (!user) {
                    return;
                }
                let room = await prisma.chatroom.findFirst({
                    where: {
                        userId: user.id,
                    },
                });
                if (!room) {
                    room = await prisma.chatroom.create({
                        data: {
                            userId: user.id,
                        },
                    });
                }
                socket.join(room.id);
            }
            if (socket.role === "ADMIN") {
                const chatRooms = await prisma.chatroom.findMany({});
                socket.join(chatRooms.map((c) => c.id));
            }
        });

        socket.on("send_message", async (data) => {
            console.log(data);
            const { senderId, message, userId } = data;
            const room = await prisma.chatroom.findFirst({
                where: {
                    userId,
                },
            });
            if (!room) {
                console.log(room);
                return;
            }

            const newMessage = await prisma.message.create({
                data: {
                    chatroomId: room.id,
                    senderId: +senderId,
                    message: message,
                    sendDate: new Date(),
                },
                include: {
                    chatroom: true,
                    sender: true,
                },
            });
            console.log(io.sockets.adapter.rooms);
            io.to(room.id).emit(`new_message`, newMessage);
        });

        socket.on("join_driverRoom", () => {
            if (socket.driver.role === "USER") {
                socket.join("Driver_room");
                io.to("Driver_room").emit("test", "text test");
            }

            socket.on("test", (text) => {
                console.log(text);
                io.to("Driver_room").emit("test2", text);
                // io.emit("test2", text);
            });

            socket.on("disconnect", () => {
                console.log(`${socket.id} Disconnected`);
            });
        });
    });
};

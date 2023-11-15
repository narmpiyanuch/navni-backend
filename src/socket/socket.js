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
      if (socket.role !== "ADMIN") {
        // Check if the sender is a valid user
        console.log(socket);
        const user = await prisma.user.findUnique({
          where: {
            id: socket.userId,
            role: {
              not: "ADMIN",
            },
          },
        });
        if (!user) {
          return;
        }
        console.log(user);
        //   Find or create a chat room for the user and all admins
        let room = await prisma.chatroom.findFirst({
          where: {
            userId: user.id,
          },
        });
        console.log("joined", room.id);
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
      console.log(room);
      if (!room) {
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
      // console.log(io.sockets.adapter.rooms);
      //   Broadcast the message to the room
      io.to(room.id).emit(`new_message`, newMessage);
      io.to(room.id).emit(`notification`, senderId);
    });
    socket.on("disconnect", () => {
      console.log(`${socket.id} Disconnected`);
    });
  });
};

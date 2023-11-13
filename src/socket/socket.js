const createError = require("../utils/createError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.useSocket = (io) => {
  // const onlineUser = [];

  io.use((socket, next) => {
    console.log(socket.handshake.auth);
    // if (socket.handshake.auth.user.role === "USER") {
    const userId = socket.handshake.auth.user.id;

    if (!userId) {
      console.log("error connect");
      return next(createError("invalid username"));
    }
    // socket.userId = userId;
    // socket.role = socket.handshake.auth.user.role;

    // onlineUser.push({
    //   userId: socket.userId,
    //   socketId: socket.id,
    // });
    // console.log(`online : ${Object.keys(onlineUser).length}`);
    // console.log(`User connected ${socket.id}`);
    // }
    socket.userId = socket.handshake.auth.user.id;
    socket.role = socket.handshake.auth.user.role;
    next();
  });

  io.on("connection", (socket) => {
    console.log("connected: " + socket.id);

    socket.on("join_room", async (data) => {
      // const { senderId } = data;
      // console.log("join_room " + senderId);

      if (socket.role === "USER") {
        // Check if the sender is a valid user
        const user = await prisma.user.findUnique({
          where: { id: socket.userId, role: "USER" },
        });
        if (!user) {
          return;
        }
        //   Find or create a chat room for the user and all admins
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

        // Fetch and send previous chat messages for the room
        // const allChat = await prisma.message.findMany({
        //   where: {
        //     chatroomId: room.id,
        //   },
        //   include: {
        //     sender: true,
        //   },
        // });
        // io.to(room.id).emit(`room_id`, { id: room.id });
        // io.to(room.id).emit(`all_chat`, { allChat });
      }
      if (socket.role === "ADMIN") {
        const chatRooms = await prisma.chatroom.findMany({});
        socket.join(chatRooms.map((c) => c.id));
      }

      // //   Get a list of all admins
      // const receiverAdmins = await prisma.user.findMany({
      //   where: { role: "ADMIN" },
      // });
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
      //   Broadcast the message to the room
      io.to(room.id).emit(`new_message`, newMessage);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} Disconnected`);
    });
  });
};

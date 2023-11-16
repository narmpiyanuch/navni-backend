const createError = require("../utils/createError");
const prisma = require("../model/prisma");
const { employeeFunction } = require("../controller/driverController");

exports.useSocket = (io) => {
  io.use((socket, next) => {
    const userId = socket.handshake.auth.user.id;

    if (!userId) {
      return next(createError("invalid username"));
    }
    socket.userId = socket.handshake.auth.user.id;
    socket.role = socket.handshake.auth.user.role;
    next();
  });

  io.on("connection", (socket) => {
    socket.on("join_room", async (data) => {
      if (socket.role === "DRIVER") {
        socket.join("DRIVER");
      }
      if (socket.role === "USER") {
        socket.join("USER");
      }

      if (socket.role !== "ADMIN") {
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
        let room = await prisma.chatroom.findFirst({
          where: {
            userId: user.id,
          },
        });
        socket.join(room.id);
      }
      if (socket.role === "ADMIN") {
        const chatRooms = await prisma.chatroom.findMany({});
        socket.join(chatRooms.map((c) => c.id));
      }
    });

    socket.on("send_message", async (data) => {
      // console.log(data);
      const { senderId, message, userId } = data;
      const room = await prisma.chatroom.findFirst({
        where: {
          userId,
        },
      });
      // console.log(room);
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
      io.to(room.id).emit(`new_message`, newMessage);
      io.to(room.id).emit(`notification`, senderId);
    });

    socket.on("send_bookingRequest", async (data) => {
      console.log(data);
      const driver = await prisma.carinformation.findMany({
        where: {
          quantity: {
            gte: data?.passenger,
          },
        },
      });
      io.to("DRIVER").emit("receive_requestBooking", { data, driver });
    });

    socket.on("cancel_requestBooking", () => {
      io.to("DRIVER").emit("cancel_requestBooking");
    });

    socket.on("accept_requestBooking", () => {
      io.to("USER").emit("update_status");
    });

    socket.on("confirm_pickup", () => {
      io.to("USER").emit("changing_status");
    });

    socket.on("mission_completed", async (data) => {
      const memberInformation = data;
      console.log(data);
      const memberInfor = await prisma.memberInformation.findFirst({
        where: {
          id: data.memberInformationId,
        },
      });
      io.to("USER").emit("take_me_home", memberInfor);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} Disconnected`);
    });
  });
};

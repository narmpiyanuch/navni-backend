const prisma = require("../model/prisma");

exports.createMessage = async (req, res, next) => {
  const { userId, senderId, message } = req.body;

  try {
    const room = await prisma.chatroom.findFirst({
      where: {
        userId,
      },
    });
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
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

exports.getMessage = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const chatRoom = await prisma.chatroom.findFirst({
      where: {
        userId: +userId,
      },
    });

    if (!chatRoom) {
      return res.status(200).json([]);
    }

    const messages = await prisma.message.findMany({
      where: {
        chatroomId: chatRoom.id,
      },
      orderBy: {
        sendDate: "asc",
      },
      include: {
        chatroom: true,
        sender: true,
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

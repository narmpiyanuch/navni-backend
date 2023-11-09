const prisma = require("../model/prisma");
const { memberFunction } = require("../controller/userConroller");

exports.createBooking = async (req, res, next) => {
  try {
    const {
      carinformationId,
      pickedUpStationId,
      dropDownStationId,
      passenger,
      price,
    } = req.body;

    const allMemberInformation = await memberFunction(req, res);
    const booking = await prisma.booking.create({
      data: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
        carinformationId: +carinformationId,
        pickedUpStationId: +pickedUpStationId,
        dropDownStationId: +dropDownStationId,
        passenger: +passenger,
        price: +price,
      },
    });
    res.status(201).json({ message: "Booking Sucessfully", booking });
  } catch (error) {
    next(error);
  }
};

exports.getServiceHistory = async (req, res, next) => {
  try {
    const allMemberInformation = await memberFunction(req, res);
    const booking = await prisma.booking.findMany({
      where: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        price: true,
        pickedUpStation: {
          select: {
            stationName: true,
          },
        },
        dropDownStation: {
          select: {
            stationName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ booking });
  } catch (error) {
    next(error);
  }
};

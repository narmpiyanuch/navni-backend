const prisma = require("../model/prisma");
const { memberFunction } = require("../controller/userConroller");
const createError = require("../utils/createError");

exports.createBooking = async (req, res, next) => {
  try {
    const { pickedUpStationId, dropDownStationId, passenger, price } = req.body;

    const memberInformation = await memberFunction(req, res);

    const bookingItem = await prisma.booking.findMany({
      where: {
        memberInformationId: memberInformation.id,
        OR: [{ status: "COMING" }, { status: "PICKED" }, { status: "WAITING" }],
      },
    });

    if (bookingItem) {
      return next(createError("Cant booking trip"));
    }

    const booking = await prisma.booking.create({
      data: {
        memberInformationId: memberInformation.memberInformation[0].id,
        pickedUpStationId: +pickedUpStationId,
        dropDownStationId: +dropDownStationId,
        passenger: +passenger,
        price: +price,
      },
    });
    const pickup = await prisma.subAreaStation.findUnique({
      where: {
        id: booking.pickedUpStationId,
      },
    });

    const drop = await prisma.subAreaStation.findUnique({
      where: {
        id: booking.dropDownStationId,
      },
    });

    res.status(201).json({ booking, pickup, drop });
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
        AND: {
          OR: [{ status: "DONE" }, { status: "CANCEL" }],
        },
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

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.body;
    const bookingItem = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (bookingItem.status === "PICKED") {
      next(createError("Can't cancel this trip", 400));
    }

    if (bookingItem.status === "WAITING" || bookingItem.status === "COMING") {
      await prisma.booking.update({
        data: {
          status: "CANCEL",
        },
        where: {
          id: bookingItem.id,
        },
      });
    }

    if (
      bookingItem.status === "COMING" &&
      bookingItem.carinformationId !== null
    ) {
      await prisma.carinformation.update({
        data: {
          quantity: {
            increment: bookingItem.passenger,
          },
        },
        where: {
          id: bookingItem.carinformationId,
        },
      });
    }

    res.status(200).json(bookingItem);
  } catch (error) {
    next(error);
  }
};

exports.getBookingForUser = async (req, res, next) => {
  try {
    const memberInformation = await memberFunction(req, res);

    const bookingItem = await prisma.booking.findMany({
      where: {
        memberInformationId: memberInformation.id,
        OR: [{ status: "COMING" }, { status: "PICKED" }, { status: "WAITING" }],
      },
      include: {
        dropDownStation: true,
        pickedUpStation: true,
        carInformation: true,
      },
    });

    res.status(200).json(bookingItem);
  } catch (error) {
    next(error);
  }
};

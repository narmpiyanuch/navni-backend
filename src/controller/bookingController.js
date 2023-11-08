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

    const memberInformation = await memberFunction(req, res);
    const booking = await prisma.booking.create({
      data: {
        memberInformationId: memberInformation.memberInformation[0].id,
        carinformationId: +carinformationId,
        pickedUpStationId: +pickedUpStationId,
        dropDownStationId: +dropDownStationId,
        passenger: +passenger,
        price: +price,
      },
    });
    res.status(201).json({ message: "Booking Sucessfully" });
  } catch (error) {
    next(error);
  }
};

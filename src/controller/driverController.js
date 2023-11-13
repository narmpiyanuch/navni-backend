const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const { upload } = require("../utils/cloudinary_service");
const { registerDriverSchema } = require("../validators/driverValidate");
const confirmRegisterDriverEmail = require("../config/confirmRegister");
const approveRegisterDriverEmail = require("../config/approveRegister");

const employeeFunction = async (req, res) => {
  const userInformation = await prisma.user.findMany({
    where: {
      id: req.user.id,
    },
    include: {
      employeeInformation: true,
    },
  });
  if (!userInformation) {
    return res.status(400).json({ message: "user not found" });
  }

  const [allEmployeeInformation] = userInformation;
  return allEmployeeInformation;
};

exports.employeeFunction = employeeFunction;

exports.registerDriver = async (req, res, next) => {
  try {
    const newData = JSON.parse(req.body.driverData);
    const { value, error } = registerDriverSchema.validate(newData);

    if (error) {
      console.log(error);
      return next(createError("Invalid Register", 400));
    }

    const { password, ...information } = value;
    const hashPassword = await bcrypt.hash(password, 12);

    if (!req.file) {
      const driver = await prisma.RegisterEmployeeInformation.create({
        data: {
          ...information,
          password: hashPassword,
        },
      });
      const emailDriver = driver.email;
      confirmRegisterDriverEmail(emailDriver);
      delete driver.password;

      return res
        .status(201)
        .json({ driver, message: "Register Driver Successful!" });
    } else {
      const response = {};
      const url = await upload(req.file.path);
      response.image = url;
      const driver = await prisma.RegisterEmployeeInformation.create({
        data: {
          ...information,
          password: hashPassword,
          image: url,
        },
      });
      const emailDriver = driver.email;
      confirmRegisterDriverEmail(emailDriver);
      delete driver.password;
      return res
        .status(201)
        .json({ driver, message: "Register Driver Successful!" });
    }
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.getAllRegisterDriver = async (req, res, next) => {
  try {
    const allDriver = await prisma.RegisterEmployeeInformation.findMany({});
    res.status(200).json({ allDriver });
  } catch (err) {
    next(err);
  }
};


exports.getAllDriverEmployee = async (req,res,next) =>{
  try {
    const driversEmployee = await prisma.user.findMany({
      where:{
        role:"DRIVER"
      },include:{
        employeeInformation:{
          include:{
            carinfomation:true
          }
        },
  
      }
    })
    res.status(200).json({driversEmployee})
  } catch (error) {
    next(error)
  }
}


exports.createDriver = async (req, res, next) => {
  try {
    const { id, plateNumber } = req.body;
    console.log(id, plateNumber);
    const driver = await prisma.RegisterEmployeeInformation.findFirst({
      where: {
        id: +id,
      },
    });
    console.log(driver);
    const user = await prisma.user.create({
      data: {
        email: driver.email,
        password: driver.password,
        role: "DRIVER",
      },
    });
    const employee = await prisma.employeeInformation.create({
      data: {
        userId: user.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        idCard: driver.idCard,
        phoneNumber: driver.phoneNumber,
        gender: driver.gender,
        image: driver.image,
      },
    });
    const carInformation = await prisma.carinformation.create({
      data: {
        employeeInformationId: employee.id,
        plateNumber: plateNumber,
      },
    });

    const emailDriver = driver.email;
    approveRegisterDriverEmail(emailDriver);

    await prisma.registerEmployeeInformation.delete({
      where: {
        id: +id,
      },
    });

    res.status(201).json({ message: "Completed" });
  } catch (error) {
    next(error);
  }
};

exports.getDriverProfile = async (req, res, next) => {
  try {
    const allEmployeeInformation = await employeeFunction(req, res);
    console.log(allEmployeeInformation)
    const carinformation = await prisma.carinformation.findFirst({
      where: {
        employeeInformationId: allEmployeeInformation.employeeInformation[0].id,
      },
    });
    const driverProfile = {
      firstName: allEmployeeInformation.employeeInformation[0].firstName,
      image: allEmployeeInformation.employeeInformation[0].image,

      plateNumber: carinformation.plateNumber,
      seats:carinformation.quantity
    };
    res.status(200).json({ driverProfile });
  } catch (error) {
    next(error);
  }
};

exports.getDriverHistory = async (req, res, next) => {
  try {
    const allEmployeeInformation = await employeeFunction(req, res);
    const carinformation = await prisma.carinformation.findFirst({
      where: {
        employeeInformationId: allEmployeeInformation.employeeInformation[0].id,
      },
    });
    const driverHistory = await prisma.booking.findMany({
      where: {
        carinformationId: carinformation.id,
        AND: {
          OR: [{ status: "DONE" }, { status: "CANCEL" }],
        },
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
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
    res.status(200).json({ driverHistory });
  } catch (error) {
    next(error);
  }
};


exports.changeDriverStatus = async (req,res,next) =>{
  try {
    const {id,status} = req.body
   console.log(status)
    if (status === false) {
      const active = await prisma.employeeInformation.update({
        where: {
          id,
        },
        data: {
          status: false,
        },
      });
      return res.status(200).json({ active });
    }

    if (status === true) {
      const inActive = await prisma.employeeInformation.update({
        where: {
          id,
        },
        data: {
          status: true,
        },
      })
      return res.status(200).json({ inActive });
    }
    res.status(200).json({ msg: "Success" });
  } catch (error) {
    next(error)
  }
}
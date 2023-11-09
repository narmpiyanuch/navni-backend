const axios = require("axios");
const prisma = require("../model/prisma");

// exports.getDistance = async (req, res, next) => {
//   try {
//     const station = [
//       "โรงพยาบาลทหารผ่านศึก",
//       "โรงพยาบาลพระมงกุฎเกล้า",
//       "โรงพยาบาลราชวิถี",
//       "คิง เพาเวอร์ รางน้ำ",
//       "สวนสันติภาพ",
//     ];
//     // console.log(req.query);
//     const map = await axios.get(
//       `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations1}|${req.query.destinations2}|${req.query.destinations3}|${req.query.destinations4}|${req.query.destinations5}&origins=${req.query.origins}&key=${process.env.GOOGLE_KEY}&mode=Driving`
//     );

//     //  console.log(map)
//     const address = map.data.destination_addresses.reduce((acc, item) => {
//       input = {};
//       input["address"] = item;
//       return [...acc, input];
//     }, []);
//     // console.log(response.data.destination_addresses[0])
//     const distance = map.data.rows[0].elements.reduce((acc, item) => {
//       input = {};
//       input["distance"] = item.distance.text;
//       return [...acc, input];
//     }, []);

//     const data = address.map((item, index) => {
//       return [...[], item, distance[index]];
//     });

//     // console.log(response.data.rows[0])

//     res
//       .status(200)
//       .json({ origin: map.data.origin_addresses, from: data, station });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.addWorkArea = async (req, res, next) => {
  try {
    const {
      body: { area_name, latitude, longitude, radius },
    } = req;
    console.log(area_name, latitude, longitude, radius);
    const workArea = await prisma.workArea.create({
      data: {
        areaName: area_name,
        longitude,
        latitude,
        radius,
      },
    });
    console.log(workArea);

    res.status(201).json({ msg: "Create Complete" });
  } catch (error) {
    next(error);
  }
};

exports.addSubArea = async (req, res, next) => {
  try {
    const {
      body: { stationName, latitude, longitude, workAreaId },
    } = req;

    console.log(stationName, latitude, longitude, workAreaId);

    const workarea = await prisma.workArea.findUnique({
      where: {
        id: workAreaId,
      },
      select: {
        id: true,
      },
    });

    const subarea = await prisma.subAreaStation.create({
      data: {
        stationName,
        latitude: latitude,
        longitude: longitude,
        workAreaId: workarea.id,
      },
    });

    res.status(201).json({ msg: subarea });
  } catch (error) {
    next(error);
  }
};

exports.selectArea = async (req, res, next) => {
  try {
    const {
      body: { id },
    } = req;
    const origin = await prisma.subAreaStation.findMany({
      where: {
        id: id,
      },
    });

    const area = await prisma.subAreaStation.findMany({
      where: {
        status:true,
        NOT: {
          id: id,
        },
      },
    });
    const latlng = area.reduce((acc, data) => {
      let input = {};
      input = `${data.latitude},${data.longitude}`;
      return [...acc, input];
    }, []);

    const latlngtostring = latlng.join("|");

    const map = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${latlngtostring}&origins=${origin[0].latitude},${origin[0].longitude}&key=${process.env.GOOGLE_KEY}&mode=Driving`
    );

    const toStation = map.data.rows[0].elements.map((data, index) => {
      return {
        id: area[index].id,
        stationName: area[index].stationName,
        address: map.data.destination_addresses[index],
        distance: data.distance.text,
      };
    });

    // console.log(map.data.rows[0].elements)

    res.status(200).json({ toStation });
  } catch (error) {
    next(error);
  }
};

exports.getSubArea = async (req, res, next) => {
  try {
    const subAreaStation = await prisma.subAreaStation.findMany({
      include: {
        workArea: true,
      },
    });

    res.status(200).json({ subAreaStation });
  } catch (error) {
    next(error);
  }
};

exports.calculate = async (req, res, next) => {
  try {
    const {
      body: { destination, origin },
    } = req;

    const dataDestination = await prisma.subAreaStation.findMany({
      where: {
        id: destination.id,
      },
    });
    // console.log(dataOrigin[0].latitude)
    const dataOrigin = await prisma.subAreaStation.findMany({
      where: {
        id: origin.id,
      },
    });

    const map = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${dataDestination[0].latitude},${dataDestination[0].longitude}&origins=${dataOrigin[0].latitude},${dataOrigin[0].longitude}&key=${process.env.GOOGLE_KEY}&mode=Driving`
    );
    distance = map.data.rows[0].elements[0].distance.text.slice(0, -3);
    // console.log(map.data.rows[0].elements[0].distance.text)
    // console.log(distance)
    const price = 25 + 5 * Number(distance);

    // console.log(price)
    res.status(200).json({ price });
  } catch (error) {
    next(error);
  }
};

exports.getWorkArea = async (req, res, next) => {
  try {
    const area = await prisma.workArea.findMany({});

    res.status(200).json({ area });
  } catch (error) {
    next(error);
  }
};

exports.editStationName = async (req, res, next) => {
  try {
    const {
      body: { id, stationName },
    } = req;
    console.log(id, stationName);

    const subAreaStation = await prisma.subAreaStation.findUnique({
      where: { id },
    });

    const newNameSubAreaStation = await prisma.subAreaStation.updateMany({
      data: {
        stationName,
      },
      where: {
        id,
      },
    });

    res.status(200).json(newNameSubAreaStation);
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const {
      body: { id, status },
    } = req;

    if (status === true) {
      const offArea = await prisma.subAreaStation.updateMany({
        where: {
          id,
        },
        data: {
          status: false,
        },
      });
      res.status(200).json({offArea})
    }

    if(status===false){

      
      const onArea = await prisma.subAreaStation.updateMany({
        where:{
          id
        }
        ,
        data:{
          status: true
        }
      })
      
      res.status(200).json({ msg: "on Station" });
    }
  } catch (error) {
    next(error);
  }
};

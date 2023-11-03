const axios = require("axios");
const prisma = require("../model/prisma");

exports.getDistance = async (req, res, next) => {
  try {
    const station = [
      "โรงพยาบาลทหารผ่านศึก",
      "โรงพยาบาลพระมงกุฎเกล้า",
      "โรงพยาบาลราชวิถี",
      "คิง เพาเวอร์ รางน้ำ",
      "สวนสันติภาพ",
    ];
    // console.log(req.query);
    const map = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations1}|${req.query.destinations2}|${req.query.destinations3}|${req.query.destinations4}|${req.query.destinations5}&origins=${req.query.origins}&key=${process.env.GOOGLE_KEY}&mode=Driving`
    );

    //  console.log(map)
    const address = map.data.destination_addresses.reduce((acc, item) => {
      input = {};
      input["address"] = item;
      return [...acc, input];
    }, []);
    // console.log(response.data.destination_addresses[0])
    const distance = map.data.rows[0].elements.reduce((acc, item) => {
      input = {};
      input["distance"] = item.distance.text;
      return [...acc, input];
    }, []);

    const data = address.map((item, index) => {
      return [...[], item, distance[index]];
    });

    // console.log(response.data.rows[0])

    res
      .status(200)
      .json({ origin: map.data.origin_addresses, from: data, station });
  } catch (error) {
    console.log(error);
  }
};

exports.addWorkArea = async (req, res, next) => {
  try {
    const {
      body: { areaName },
    } = req;
    const workArea = await prisma.workArea.create({
      data: {
        areaName: areaName,
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
    console.log(subarea);
    res.status(201).json({ msg: "create area" });
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

    console.log(latlngtostring)
    const map = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${latlngtostring}&origins=${origin[0].latitude},${origin[0].longitude}&key=${process.env.GOOGLE_KEY}&mode=Driving`
    );
 
   
    const toStation = map.data.rows[0].elements.map((data, index) => {
      return         { id:area[index].id ,
         stationName: area[index].stationName ,
        address :map.data.destination_addresses[index],
        distance : data.distance.text}
      
    });

    // console.log(map.data.rows[0].elements)

    res.status(200).json({ toStation });
  } catch (error) {
    next(error);
  }
};

exports.getSubArea = async (req, res, next) => {
  try {
    const subAreaStation = await prisma.subAreaStation.findMany({});

    res.status(200).json({ subAreaStation });
  } catch (error) {
    next(error);
  }
};

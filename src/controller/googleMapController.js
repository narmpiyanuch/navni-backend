const axios = require("axios");

exports.getDistance = async (req, res, next) => {
  try {
    const map = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations1}|${req.query.destinations2}&origins=${req.query.origins}&key=AIzaSyAH2nRas0VLgTR-_IxjrCVnpijGpbJcUxI&mode=Driving`
    );
        // console.dir(response.data)
        const address = map.data.destination_addresses.reduce((acc,item)=>{
            input = {}
            input['address']=item
            return [...acc,input]
        },[])
        // console.log(response.data.destination_addresses[0])
        const distance = map.data.rows[0].elements.reduce((acc,item)=>{
            input={}
            input['distance']=item.distance.text
            return[...acc,input]
            
        },[])
        console.log(address[0])
       console.log(distance)
        

        const data = address.map((item,index)=>{
            
            return [...[],item,distance[index]]

        })
        console.log(data)
//         console.log(distance)
// // console.log(response.data.rows[0])

    res.status(200).json({ msg: map.data,from : data });
  } catch (error) {
    console.log(error);
  }
};

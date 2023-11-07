require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const mapRoute = require("./routes/mapRoute");
const userRoute = require("./routes/userRoute");
const paymentRoute = require("./routes/paymentRoute");
const driverRoute = require("./routes/driverRoute")
const errorMiddleware = require("./middleWare/errorMiddleware");
const notFoundMiddleware = require("./middleWare/notFoundMiddleware");
const authenticateMiddleware = require("./middleWare/authenticateMiddleware");

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

app.use("/map", mapRoute);
app.use("/auth", authRoute);
app.use("/user", authenticateMiddleware, userRoute);
app.use("/payment", authenticateMiddleware, paymentRoute);
app.use("/driver", driverRoute)

app.use(notFoundMiddleware);
app.use(errorMiddleware);



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`SERVER RUN IN PORT :${PORT}`));

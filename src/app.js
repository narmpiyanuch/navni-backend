require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const mapRoute = require("./routes/mapRoute");
const userRoute = require("./routes/userRoute");
const paymentRoute = require("./routes/paymentRoute");
const bookingRoute = require("./routes/bookingRoute");
const driverRoute = require("./routes/driverRoute");
const adminRoute = require("./routes/adminRoute");
const errorMiddleware = require("./middleWare/errorMiddleware");
const notFoundMiddleware = require("./middleWare/notFoundMiddleware");
const authenticateMiddleware = require("./middleWare/authenticateMiddleware");
const checkAdminMiddleware = require("./middleWare/checkAdminMiddleware");
const { useSocket, testIoMiddleWare } = require("./socket/socket");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

app.use("/map", mapRoute);
app.use("/auth", authRoute);
app.use("/user", authenticateMiddleware, userRoute);
app.use("/payment", authenticateMiddleware, paymentRoute);
app.use("/booking", authenticateMiddleware, bookingRoute);
app.use("/driver", driverRoute);
app.use("/admin", authenticateMiddleware, checkAdminMiddleware, adminRoute);

useSocket(io);
testIoMiddleWare(io);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`SERVER RUN IN PORT :${PORT}`));

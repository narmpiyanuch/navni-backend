require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const mapRoute = require("./routes/mapRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const paymentRoute = require("./routes/paymentRoute");
const bookingRoute = require("./routes/bookingRoute");
const driverRoute = require("./routes/driverRoute");
const adminRoute = require("./routes/adminRoute");

const checkAdminMiddleware = require("./middleWare/roleIdentifierMiddleware");
const errorMiddleware = require("./middleWare/errorMiddleware");
const notFoundMiddleware = require("./middleWare/notFoundMiddleware");
const authenticateMiddleware = require("./middleWare/authenticateMiddleware");
const messageRoute = require("./routes/messageRoute");
const { useSocket, testIoMiddleWare } = require("./socket/socket");

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

useSocket(io);

app.use("/message", messageRoute);
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

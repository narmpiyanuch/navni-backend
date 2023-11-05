require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const errorMiddleware = require("./middleWare/errorMiddleware");
const notFoundMiddleware = require("./middleWare/notFoundMiddleware");
const authenticateMiddleware = require("./middleWare/authenticateMiddleware");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("someone has left");
  });
});

app.use("/auth", authRoute);
app.use("/user", authenticateMiddleware, userRoute);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => console.log(`SERVER RUN IN PORT :${PORT}`));

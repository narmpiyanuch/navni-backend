const chalk = require("chalk");
const createError = require("../utils/createError");

const onlineDriver = [];

exports.testIoMiddleWare = (io) => {
    io.use((socket, next) => {
        if (socket.handshake.auth.user.role === "USER") {
            const driverId = socket.handshake.auth.user.id;

            if (!driverId) {
                console.log(chalk.red("error connect"));
                return next(createError("invalid username"));
            }
            socket.driver = socket.handshake.auth.user;

            onlineDriver.push({
                driverId: socket.driverId,
                socketId: socket.id,
            });
            console.log(
                chalk.greenBright(
                    `online : ${Object.keys(onlineDriver).length}`
                )
            );
            console.log(chalk.greenBright(`Driver connected ${socket.id}`));
        }
        next();
    });
};

exports.useSocket = (io) => {
    io.on("connection", (socket) => {
        // console.log(socket.driver);
        // io.emit("onlineDriver", onlineDriver);

        socket.on("join_driverRoom", () => {
            if (socket.driver.role === "USER") {
                socket.join("Driver_room");
                io.to("Driver_room").emit("test", "text test");
            }
        });
        socket.on("test", (text) => {
            console.log(text);
            io.to("Driver_room").emit("test2", text);
            // io.emit("test2", text);
        });

        socket.on("disconnect", () => {
            console.log(`User ${socket.id} disconnect`);
        });
    });
};

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`SERVER RUN IN PORT :${PORT}`));

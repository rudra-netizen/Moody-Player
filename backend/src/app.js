const express = require("express");
const songRoutes = require("./routes/song.routes");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/", songRoutes); //batane ke liye ki apun api bna rhe routes folder k andar usko use krne ka hai
module.exports = app;

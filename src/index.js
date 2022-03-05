const routes = require("./router");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cors());
app.use(routes);

app.listen(3002);

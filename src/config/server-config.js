require("dotenv").config();
const fs = require("fs");
const path = require("path");

module.exports = {
  PORT: process.env.PORT,
  PUBLIC_KEY: fs.readFileSync(path.join(__dirname, "../../public.key"), "utf8"),
};

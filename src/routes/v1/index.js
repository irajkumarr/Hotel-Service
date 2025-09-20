const express = require("express");
const hotelRoutes = require("../v1/hotel-routes");

const router = express.Router();

router.use("/hotels", hotelRoutes);

module.exports = router;

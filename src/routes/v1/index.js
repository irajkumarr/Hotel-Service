const express = require("express");
const hotelRoutes = require("../v1/hotel-routes");
const roomGenerationRoutes = require("../v1/room-generation-routes");

const router = express.Router();

router.use("/hotels", hotelRoutes);
router.use("/rooms", roomGenerationRoutes);

module.exports = router;

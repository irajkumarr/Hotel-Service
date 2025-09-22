const express = require("express");
const hotelRoutes = require("../v1/hotel-routes");
const roomRoutes = require("../v1/room-routes");
const roomGenerationRoutes = require("../v1/room-generation-routes");
const roomSchedulerRoutes = require("../v1/room-scheduler-routes");

const router = express.Router();

router.use("/hotels", hotelRoutes);
router.use("/rooms", roomRoutes);
router.use("/room-generation", roomGenerationRoutes);
router.use("/scheduler", roomSchedulerRoutes);

module.exports = router;

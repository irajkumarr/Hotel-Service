const express = require("express");
const { HotelController } = require("../../controllers");

const router = express.Router();

// api/v1/hotels  POST
router.post("/", HotelController.createHotel);

module.exports = router;

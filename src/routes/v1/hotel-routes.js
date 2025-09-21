const express = require("express");
const { HotelController } = require("../../controllers");
const { HotelMiddlewares } = require("../../middlewares");

const router = express.Router();

// api/v1/hotels  POST
router.post(
  "/",
  HotelMiddlewares.validateCreateRequest,
  HotelController.createHotel
);

// api/v1/hotels  GET
router.get("/", HotelController.getHotels);

// api/v1/hotels/:id  GET
router.get("/:id", HotelController.getHotel);

module.exports = router;

const express = require("express");
const { RoomController } = require("../../controllers");

const router = express.Router();

// api/v1/rooms  POST
router.post("/", RoomController.createRoom);

// api/v1/rooms  GET
router.get("/", RoomController.getRooms);

// // api/v1/hotels/:id  GET
// router.get("/:id", HotelController.getHotel);

// // api/v1/hotels/:id  DELETE
// router.delete("/:id", HotelController.deleteHotel);

// // api/v1/hotels/:id  PATCH
// router.patch(
//   "/:id",
//   HotelMiddlewares.validateUpdateRequest,
//   HotelController.updateHotel
// );

module.exports = router;

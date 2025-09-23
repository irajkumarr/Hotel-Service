const express = require("express");
const { RoomController } = require("../../controllers");

const router = express.Router();

// api/v1/rooms  POST
router.post("/", RoomController.createRoom);

// api/v1/rooms  GET
router.get("/", RoomController.getRooms);

// api/v1/rooms/:id  GET
router.get("/:id", RoomController.getRoom);

// api/v1/rooms/:id  DELETE
router.delete("/:id", RoomController.deleteRoom);

// // api/v1/rooms/:id  PATCH
router.patch("/:id", RoomController.updateRoom);

module.exports = router;

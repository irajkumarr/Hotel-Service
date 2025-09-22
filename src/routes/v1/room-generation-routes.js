const express = require("express");
const { RoomGenerationController } = require("../../controllers");

const router = express.Router();

// api/v1/room-generation  POST
router.post("/", RoomGenerationController.generateRoom);

module.exports = router;

const express = require("express");
const { RoomGenerationController } = require("../../controllers");
const { AuthMiddlewares } = require("../../middlewares");

const { Enums } = require("../../utils/commons");
const { ADMIN, HOTEL_MANAGER } = Enums.ROLE_TYPE;
const router = express.Router();

// api/v1/room-generation  POST
router.post(
  "/",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.authorizeRoles([ADMIN, HOTEL_MANAGER]),
  RoomGenerationController.generateRoom
);

module.exports = router;

const express = require("express");
const { RoomController } = require("../../controllers");
const { RoomMiddlewares, AuthMiddlewares } = require("../../middlewares");

const { Enums } = require("../utils/commons");
const { ADMIN, HOTEL_MANAGER, HOTEL_STAFF } = Enums.ROLE_TYPE;
const router = express.Router();

// api/v1/rooms  POST
router.post(
  "/",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.authorizeRoles([ADMIN, HOTEL_MANAGER]),
  RoomMiddlewares.validateCreateRequest,
  RoomController.createRoom
);

// api/v1/rooms  GET
router.get("/", RoomController.getRooms);

// api/v1/rooms/:id  GET
router.get("/:id", RoomController.getRoom);

// api/v1/rooms/:id  DELETE
router.delete(
  "/:id",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.authorizeRoles([ADMIN, HOTEL_MANAGER]),
  RoomController.deleteRoom
);

// // api/v1/rooms/:id  PATCH
router.patch(
  "/:id",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.authorizeRoles([ADMIN, HOTEL_MANAGER, HOTEL_STAFF]),
  RoomMiddlewares.validateUpdateRequest,
  RoomController.updateRoom
);

module.exports = router;

const express = require("express");
const { HotelController } = require("../../controllers");
const { HotelMiddlewares, AuthMiddlewares } = require("../../middlewares");

const router = express.Router();

// api/v1/hotels  POST
router.post(
  "/",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.authorizeRoles(["ADMIN", "HOTEL_MANAGER"]),
  HotelMiddlewares.validateCreateRequest,
  HotelController.createHotel
);

// api/v1/hotels  GET
router.get("/", HotelController.getHotels);

// api/v1/hotels/:id  GET
router.get("/:id", HotelController.getHotel);

// api/v1/hotels/:id  DELETE
router.delete(
  "/:id",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.authorizeRoles(["ADMIN", "HOTEL_MANAGER"]),
  HotelController.deleteHotel
);

// api/v1/hotels/:id  PATCH
router.patch(
  "/:id",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.authorizeRoles(["ADMIN", "HOTEL_MANAGER","HOTEL_STAFF"]),
  HotelMiddlewares.validateUpdateRequest,
  HotelController.updateHotel
);

module.exports = router;

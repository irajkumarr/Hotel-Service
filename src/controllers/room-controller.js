const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../middlewares");
const { RoomService } = require("../services");
const { SuccessResponse } = require("../utils/commons");

/**
 * POST : /
 * req-body {roomCategoryId:2,dateOfAvailability:"2025-09-08"}
 */
const createRoom = asyncHandler(async (req, res) => {
  const { roomCategoryId, dateOfAvailability } = req.body;
  const room = await RoomService.createRoom({
    roomCategoryId,
    dateOfAvailability,
  });
  SuccessResponse.data = room;
  return res.status(StatusCodes.CREATED).json(SuccessResponse);
});

/**
 * GET : /
 * req-body {}
 */
const getRooms = asyncHandler(async (req, res) => {
  const result = await RoomService.getRooms(req.query);
  SuccessResponse.data = result;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * GET : /
 * req-body {}
 */
const getRoom = asyncHandler(async (req, res) => {
  const room = await RoomService.getRoom(req.params.id);
  SuccessResponse.data = room;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * DELETE : /
 * req-body {}
 */
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await RoomService.deleteRoom(req.params.id);
  SuccessResponse.data = room;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * PATCH : /
 * req-body {price:3000}
 */
const updateRoom = asyncHandler(async (req, res) => {
  const { price } = req.body;
  const room = await RoomService.updateRoom(req.params.id, {
    price,
  });
  SuccessResponse.data = room;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  deleteRoom,
  updateRoom,
};

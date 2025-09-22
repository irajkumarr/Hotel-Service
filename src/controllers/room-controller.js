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

module.exports = {
  createRoom,
};

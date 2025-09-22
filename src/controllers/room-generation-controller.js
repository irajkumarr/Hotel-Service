const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../middlewares");
const { RoomGenerationService } = require("../services");
const { SuccessResponse } = require("../utils/commons");
const {
  addRoomGenerationJobToQueue,
} = require("../producers/room-generation-producer");

/**
 * POST : /
 * req-body {roomCategoryId:2,startDate:"2025-02-02",endDate:"2025-09-09"}
 */
const generateRoom = asyncHandler(async (req, res) => {
  await addRoomGenerationJobToQueue(req.body);
  SuccessResponse.message = "Room generation job added to queue";
  return res.status(StatusCodes.CREATED).json(SuccessResponse);
});

module.exports = {
  generateRoom,
};

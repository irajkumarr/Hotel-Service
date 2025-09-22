const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../middlewares");
const { RoomGenerationService } = require("../services");
const { SuccessResponse } = require("../utils/commons");

/**
 * POST : /
 * req-body {name:"Guest Hotel",address:"KTM",location:"Thamel"}
 */
const createRoom = asyncHandler(async (req, res) => {
  const { roomCategoryId, startDate, endDate, batchSize, priceOverride } =
    req.body;
  const rooms = await RoomGenerationService.generateRooms({
    roomCategoryId,
    startDate,
    endDate,
    batchSize,
    priceOverride,
  });
  SuccessResponse.data = rooms;
  return res.status(StatusCodes.CREATED).json(SuccessResponse);
});

module.exports = {
  createRoom,
};

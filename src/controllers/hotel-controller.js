const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../middlewares");
const { HotelService } = require("../services");
const { SuccessResponse } = require("../utils/commons");

/**
 * POST : /
 * req-body {name:"Guest Hotel",address:"KTM",location:"Thamel"}
 */
const createHotel = asyncHandler(async (req, res) => {
  const { name, address, location } = req.body;
  const hotel = await HotelService.createHotel({
    name,
    address,
    location,
  });
  SuccessResponse.data = hotel;
  return res.status(StatusCodes.CREATED).json(SuccessResponse);
});

module.exports = {
  createHotel,
};

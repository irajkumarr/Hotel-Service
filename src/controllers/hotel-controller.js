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

/**
 * GET : /
 * req-body {}
 */
const getHotels = asyncHandler(async (req, res) => {
  const hotels = await HotelService.getHotels();
  SuccessResponse.data = hotels;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * GET : /
 * req-body {}
 */
const getHotel = asyncHandler(async (req, res) => {
  const hotel = await HotelService.getHotel(req.params.id);
  SuccessResponse.data = hotel;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * DELETE : /
 * req-body {}
 */
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await HotelService.deleteHotel(req.params.id);
  SuccessResponse.data = hotel;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * PATCH : /
 * req-body {name:"Guest Hotel",address:"KTM",location:"Thamel"}
 */
const updateHotel = asyncHandler(async (req, res) => {
  const { name, address, location } = req.body;
  const hotel = await HotelService.updateHotel(req.params.id, {
    name,
    address,
    location,
  });
  SuccessResponse.data = hotel;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

module.exports = {
  createHotel,
  getHotels,
  getHotel,
  deleteHotel,
  updateHotel,
};

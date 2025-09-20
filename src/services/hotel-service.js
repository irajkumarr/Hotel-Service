const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils");
const { HotelRepository } = require("../repositories");

const hotelRepository = new HotelRepository();

async function createHotel(data) {
  try {
    const hotel = await hotelRepository.create( data );
    return hotel;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    // Validation error
    if (error.name === "PrismaClientValidationError") {
      throw new AppError("Invalid input", StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Something went wrong while creating hotel",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createHotel,
};

const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils");
const { HotelRepository } = require("../repositories");

const hotelRepository = new HotelRepository();

async function createHotel(data) {
  try {
    const hotel = await hotelRepository.create(data);
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

async function getHotels(data) {
  try {
    const hotels = await hotelRepository.getAll();
    if (hotels.length === 0) {
      throw new AppError(
        "No hotels found in the database",
        StatusCodes.NOT_FOUND
      );
    }
    return hotels;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Cannot fetch data of all hotels",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getHotel(id) {
  try {
    const hotel = await hotelRepository.get(Number(id));
    return hotel;
  } catch (error) {
    if ((error.statusCode = StatusCodes.NOT_FOUND)) {
      throw new AppError(
        "The hotel you requested is not present",
        error.statusCode
      );
    }
    throw new AppError(
      "Cannot fetch data of hotel",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function deleteHotel(id) {
  try {
    const hotel = await hotelRepository.softDelete(Number(id));
    return hotel;
  } catch (error) {
    if (error.name === "PrismaClientKnownRequestError") {
      throw new AppError(
        "The hotel you requested to delete is not present",
        StatusCodes.NOT_FOUND
      );
    }
    throw new AppError(
      "Cannot fetch data of hotel",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createHotel,
  getHotels,
  getHotel,
  deleteHotel,
};

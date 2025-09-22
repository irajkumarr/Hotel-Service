const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils");
const {
  RoomRepository,
  HotelRepository,
  RoomCategoryRepository,
} = require("../repositories");

const roomRepository = new RoomRepository();
const hotelRepository = new HotelRepository();
const roomCategoryRepository = new RoomCategoryRepository();

async function createRoom(data) {
  try {
    //check hotel exists
    const hotel = await hotelRepository.get(+data.hotelId);

    //check room category exists
    const roomCategory = await roomCategoryRepository.get(+data.roomCategoryId);
    //check availability date
    dateOfAvailability = new Date(data.dateOfAvailability);
    if (dateOfAvailability <= new Date()) {
      throw new AppError(
        `Start date must be in the future`,
        StatusCodes.BAD_REQUEST
      );
    }
    const room = await roomRepository.create({
      hotel: data.hotelId,
      roomCategoryId: data.roomCategoryId,
      dateOfAvailability: dateOfAvailability,
      price: roomCategory.price,
    });
    return room;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError(
        "The hotel you requested is not present",
        error.statusCode
      );
    }
    // Validation error
    if (error.name === "PrismaClientValidationError") {
      throw new AppError("Invalid input", StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Something went wrong while creating room",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createRoom,
};

const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils");
const { RoomRepository, RoomCategoryRepository } = require("../repositories");

const roomRepository = new RoomRepository();
const roomCategoryRepository = new RoomCategoryRepository();

async function createRoom(data) {
  try {
    //  Check room category exists
    const roomCategory = await roomCategoryRepository.get(+data.roomCategoryId);

    // Check availability date
    const dateOfAvailability = new Date(data.dateOfAvailability);

    if (dateOfAvailability <= new Date()) {
      throw new AppError(
        "Availability date must be in the future",
        StatusCodes.BAD_REQUEST
      );
    }

    // Create the room
    const room = await roomRepository.create({
      hotelId: roomCategory.hotelId,
      roomCategoryId: roomCategory.id,
      dateOfAvailability,
      price: roomCategory.price,
    });

    return room;
  } catch (error) {
    if (error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError(
        "The room category you requested is not present",
        StatusCodes.NOT_FOUND
      );
    }
    if (error instanceof AppError) {
      throw error;
    }
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

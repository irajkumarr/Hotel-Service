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

async function getRooms(query) {
  let customFilter = { deletedAt: null };
  let sortFilter = [];
  const endingTripTime = " 23:59:59";
  // price 1000-4500
  if (query.price) {
    [minPrice, maxPrice] = query.price.split("-").map(Number);
    customFilter.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }
  // availableDate 2023-03-09
  if (query.availability) {
    customFilter.dateOfAvailability = {
      gte: new Date(query.availability),
      lte: new Date(query.availability + endingTripTime),
    };
  }
  // Filter by room category type (RoomCategory table)
  if (query.roomType) {
    customFilter.roomCategory = {
      roomType: query.roomType.toUpperCase(), // e.g., "Deluxe", "Standard"
    };
  }

  // Filter by hotel location and rating (Hotel table)
  if (query.hotelLocation || query.hotelRating) {
    customFilter.hotel = {};
    if (query.hotelLocation) {
      customFilter.hotel.location = {
        contains: query.hotelLocation,
        mode: "insensitive",
      };
    }
    if (query.hotelRating) {
      customFilter.hotel.rating = {
        gte: Number(query.hotelRating),
      };
    }
  }
  if (query.sort) {
    const params = query.sort.split(",");
    const sortFilters = params.map((param) => {
      const [field, order] = param.split("_");
      return { [field]: order.toLowerCase() };
    });
    sortFilter = sortFilters;
  }
  try {
    const rooms = await roomRepository.getAllRooms(customFilter, sortFilter);
    if (rooms.length === 0) {
      throw new AppError(
        "No rooms found in the database",
        StatusCodes.NOT_FOUND
      );
    }

    return rooms;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Cannot fetch data of all rooms",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createRoom,
  getRooms,
};

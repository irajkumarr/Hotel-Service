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
  // price 1000-4500
  if (query.price) {
    [minPrice, maxPrice] = query.price.split("-").map(Number);
    customFilter.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  // Availability (single date or range) 2023-09-09
  const endingAvailableTime = " 23:59:59";
  if (query.availability) {
    // Single day filter
    customFilter.dateOfAvailability = {
      gte: new Date(query.availability),
      lte: new Date(query.availability + endingAvailableTime),
    };
  } else if (query.checkIn && query.checkOut) {
    // Multi-day filter ?checkIn=2025-09-24&checkOut=2025-09-25
    customFilter.dateOfAvailability = {
      gte: new Date(query.checkIn),
      lte: new Date(query.checkOut + endingAvailableTime),
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
  // Pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const { rooms, totalCount } = await roomRepository.getAllRooms(
      customFilter,
      sortFilter,
      skip,
      limit
    );

    if (!rooms.length) {
      throw new AppError(
        "No rooms found in the database",
        StatusCodes.NOT_FOUND
      );
    }

    return {
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      data: rooms,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Cannot fetch data of all rooms",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getRoom(id) {
  try {
    const room = await roomRepository.getRoom(Number(id));
    return room;
  } catch (error) {
    if (error.statusCode == StatusCodes.NOT_FOUND) {
      throw new AppError(
        "The room you requested is not present",
        error.statusCode
      );
    }
    throw new AppError(
      "Cannot fetch data of room",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}


async function deleteRoom(id) {
  try {
    const room = await roomRepository.softDelete(Number(id));
    return room;
  } catch (error) {
    if (error.name === "PrismaClientKnownRequestError") {
      throw new AppError(
        "The room you requested to delete is not present",
        StatusCodes.NOT_FOUND
      );
    }
    throw new AppError(
      "Cannot fetch data of room",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}



module.exports = {
  createRoom,
  getRooms,
  getRoom,
  deleteRoom
};

const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils");
const { RoomRepository, RoomCategoryRepository } = require("../repositories");
const { Logger } = require("../config");

const roomRepository = new RoomRepository();
const roomCategoryRepository = new RoomCategoryRepository();

async function generateRooms(jobData) {
  let totalRoomsCreated = 0;
  let totalDatesProcessed = 0;

  try {
    const roomCategory = await roomCategoryRepository.get(
      +jobData.roomCategoryId
    );
    if (!roomCategory) {
      Logger.error(`Room category with id ${jobData.roomCategoryId} not found`);
      throw new AppError(
        `Room category with id ${jobData.roomCategoryId} not found`,
        StatusCodes.NOT_FOUND
      );
    }

    const startDate = new Date(jobData.startDate);
    const endDate = new Date(jobData.endDate);
    const today = new Date();

    if (startDate > endDate) {
      Logger.error(`Start date must be before or equal to end date`);
      throw new AppError(
        `Start date must be before or equal to end date`,
        StatusCodes.BAD_REQUEST
      );
    }

    if (startDate < today) {
      Logger.error(`Start date must be today or in the future`);
      throw new AppError(
        `Start date must be today or in the future`,
        StatusCodes.BAD_REQUEST
      );
    }

    // inclusive of endDate
    const totalDays =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    Logger.info(`Generating rooms for ${totalDays} days`);
    const batchSize = jobData.batchSize || 100;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      let batchEndDate = new Date(currentDate);
      batchEndDate.setDate(batchEndDate.getDate() + batchSize - 1);
      if (batchEndDate > endDate) batchEndDate = new Date(endDate);

      const batchResult = await processDateBatch(
        roomCategory,
        currentDate,
        batchEndDate,
        jobData.priceOverride
      );

      totalRoomsCreated += batchResult.roomsCreated;
      totalDatesProcessed += batchResult.datesProcessed;

      currentDate.setDate(batchEndDate.getDate() + 1);
    }

    return { totalRoomsCreated, totalDatesProcessed };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while generating rooms",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Process a batch of dates and create rooms if not existing
 */
async function processDateBatch(
  roomCategory,
  startDate,
  endDate,
  priceOverride
) {
  let roomsCreated = 0;
  let datesProcessed = 0;

  const roomsToCreate = [];
  try {
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Check if room exists for this date
      const existingRoom = await roomRepository.findByRoomCategoryIdAndDate(
        roomCategory.id,
        currentDate
      );
      if (!existingRoom) {
        roomsToCreate.push({
          hotelId: roomCategory.hotelId,
          roomCategoryId: roomCategory.id,
          dateOfAvailability: new Date(currentDate),
          price: +priceOverride || roomCategory.price,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
      datesProcessed++;
    }

    if (roomsToCreate.length > 0) {
      Logger.info(`Creating ${roomsToCreate.length} rooms`);
      await roomRepository.bulkCreate(roomsToCreate);

      roomsCreated += roomsToCreate.length;
    }

    return { roomsCreated, datesProcessed };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while generating rooms",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  generateRooms,
};

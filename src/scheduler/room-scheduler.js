const cron = require("node-cron");
const { ServerConfig, Logger } = require("../config");
const { RoomRepository, RoomCategoryRepository } = require("../repositories");
const {
  addRoomGenerationJobToQueue,
} = require("../producers/room-generation-producer");

const roomRepository = new RoomRepository();
const roomCategoryRepository = new RoomCategoryRepository();
let cronJob = null;

/**
 * Start the room availability extension scheduler
 * Runs on the interval defined in serverConfig.ROOM_CRON
 */
const startScheduler = () => {
  if (cronJob) {
    Logger.warn("Room scheduler is already running");
    return;
  }
  cronJob = cron.schedule(
    ServerConfig.ROOM_CRON,
    async () => {
      try {
        Logger.info("Starting room availability extension check");
        await extendRoomAvailability();
        Logger.info("Room availability extension check completed");
      } catch (error) {
        Logger.error("Error in room availability extension scheduler:", error);
      }
    },
    {
      timezone: "UTC",
    }
  );
  cronJob.start();
  Logger.info(
    `Room availability extension scheduler started - running every ${ServerConfig.ROOM_CRON}`
  );
};

/**
 * Stop the room availability extension scheduler
 */
const stopScheduler = () => {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    Logger.info("Room availability extension scheduler stopped");
  }
};

/**
 * Get scheduler status
 */
const getSchedulerStatus = () => {
  return {
    isRunning: cronJob !== null && cronJob.getStatus() === "scheduled",
  };
};

/**
 * Extend room availability by one day for all room categories
 */

const extendRoomAvailability = async () => {
  try {
    const roomCategoriesWithLatestDates =
      await roomRepository.findLatestDatesForAllCategories();
    if (roomCategoriesWithLatestDates.length === 0) {
      Logger.info("No room categories found with availability dates");
      return;
    }

    Logger.info(
      `Found ${roomCategoriesWithLatestDates.length} room categories to extend`
    );
    for (const categoryData of roomCategoriesWithLatestDates) {
      await extendCategoryAvailability(categoryData);
    }
  } catch (error) {
    Logger.error("Error extending room availability:", error);
    throw error;
  }
};

/**
 * Extend availability for a specific room category
 */
const extendCategoryAvailability = async () => {
  try {
    const { roomCategoryId, latestDate } = categoryData;

    const nextDate = new Date(latestDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const roomCategory = await roomCategoryRepository.get(roomCategoryId);
    if (!roomCategory) {
      Logger.warn(
        `Room category ${roomCategoryId} not found, skipping extension`
      );
      return;
    }
    const existingRoom = await roomRepository.findByRoomCategoryIdAndDate(
      roomCategoryId,
      nextDate
    );
    if (existingRoom) {
      Logger.debug(
        `Room for category ${roomCategoryId} on ${nextDate.toISOString()} already exists, skipping`
      );
      return;
    }
    const endDate = new Date(nextDate);
    endDate.setDate(endDate.getDate() + 1);

    const jobData = {
      roomCategoryId,
      startDate: nextDate.toISOString(),
      endDate: endDate.toISOString(),
      priceOverride: roomCategory.price,
      batchSize: 1,
    };

    await addRoomGenerationJobToQueue(jobData);
    Logger.info(
      `Added room generation job for category ${roomCategoryId} on ${nextDate.toISOString()}`
    );
  } catch (error) {
    Logger.error(
      `Error extending availability for room category ${categoryData.roomCategoryId}:`,
      error
    );
  }
};

/**
 * Manually trigger room availability extension
 */
const manualExtendAvailability = async () => {
  Logger.info("Manual room availability extension triggered");
  await extendRoomAvailability();
};

module.exports = {
  startScheduler,
  stopScheduler,
  extendCategoryAvailability,
  extendRoomAvailability,
  manualExtendAvailability,
  getSchedulerStatus,
};

const { Logger } = require("../config");
const { redisConnection } = require("../config/redis-config");
const {
  ROOM_GENERATION_PAYLOAD,
} = require("../producers/room-generation-producer");
const { ROOM_GENERATION_QUEUE } = require("../queues/room-generation-queue");
const { Worker } = require("bullmq");
const { RoomGenerationService } = require("../services");

const setupRoomGenerationJobWorker = () => {
  // Worker to process room generation-related jobs
  const roomGenerationProcessor = new Worker(
    ROOM_GENERATION_QUEUE,
    async (job) => {
      const payload = job.data;
      switch (job.name) {
        case ROOM_GENERATION_PAYLOAD:
          await RoomGenerationService.generateRooms(payload);
          Logger.info(
            `Room generation completed for: ${JSON.stringify(payload)}`
          );
          break;

        default:
          Logger.warn(`⚠️ Unknown job: ${job.name}`);
      } //process fn
    },
    { connection: redisConnection }
  );

  roomGenerationProcessor.on("failed", () => {
    console.error("Room generation processing failed");
  });

  roomGenerationProcessor.on("completed", () => {
    console.log("Room generation processing completed successfully");
  });
  Logger.info("👷 Worker listening for jobs...");
};

module.exports = {
  setupRoomGenerationJobWorker,
};

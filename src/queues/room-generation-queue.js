const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis-config");

const ROOM_GENERATION_QUEUE = "room-generation-queue";

const roomGenerationQueue = new Queue(ROOM_GENERATION_QUEUE, {
  redisConnection,
});

module.exports = {
  roomGenerationQueue,
  ROOM_GENERATION_QUEUE,
};

const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis-config");

const ROOM_GENERATION_QUEUE = "room-generation-queue";

const roomGenerationQueue = new Queue(ROOM_GENERATION_QUEUE, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // 👈 add attempts here
    backoff: {
      type: "exponential",
      delay: 5000, // 5s, 10s, 20s...
    },
    removeOnComplete: false, // 👈 keep completed jobs (good for dev/testing)
    removeOnFail: false, // keep failed jobs too
  },
});

module.exports = {
  roomGenerationQueue,
  ROOM_GENERATION_QUEUE,
};

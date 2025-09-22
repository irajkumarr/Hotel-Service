const { roomGenerationQueue } = require("../queues/room-generation-queue");

const ROOM_GENERATION_PAYLOAD = "room-generation-payload";

const addRoomGenerationJobToQueue = async (payload) => {
  return await roomGenerationQueue.add(ROOM_GENERATION_PAYLOAD, payload);
};

module.exports = {
  addRoomGenerationJobToQueue,
  ROOM_GENERATION_PAYLOAD,
};

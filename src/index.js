const express = require("express");
const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares");
const morgan = require("morgan");
const {
  attachCorrelationIdMiddleware,
} = require("./middlewares/correlation-middleware");
const {
  setupRoomGenerationJobWorker,
} = require("./processors/room-generation-processor");
const { startScheduler } = require("./scheduler/room-scheduler");

const app = express();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(attachCorrelationIdMiddleware);

//routes
app.use("/api", apiRoutes);

//* Error Handler
app.use(errorHandler);

//* Start Worker
setupRoomGenerationJobWorker();

// Start the room availability extension scheduler
startScheduler();
Logger.info("Room availability extension scheduler initialized");

//Server starting
app.listen(ServerConfig.PORT, () => {
  Logger.info(`🚀 Server started at PORT ${ServerConfig.PORT}`);
  Logger.info(`Press Ctrl+C to stop the server.`);
});

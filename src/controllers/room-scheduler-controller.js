const { asyncHandler } = require("../middlewares");
const { StatusCodes } = require("http-status-codes");
const {
  startScheduler,
  stopScheduler,
  getSchedulerStatus,
  manualExtendAvailability,
} = require("../scheduler/room-scheduler");
const { SuccessResponse } = require("../utils/commons");

/**
 * Start the room availability extension scheduler
 */
const startSchedulerHandler = asyncHandler(async (req, res) => {
  startScheduler();
  SuccessResponse.message =
    "Room availability extension scheduler started successfully";
  SuccessResponse.data = {
    status: "started",
  };
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * Stop the room availability extension scheduler
 */
const stopSchedulerHandler = asyncHandler(async (req, res) => {
  stopScheduler();
  SuccessResponse.message =
    "Room availability extension scheduler stopped successfully";
  SuccessResponse.data = {
    status: "stopped",
  };
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * Get the current status of the room availability extension scheduler
 */
const getSchedulerStatusHandler = asyncHandler(async (req, res) => {
  const status = getSchedulerStatus();
  SuccessResponse.message = "Scheduler status retrieved successfully";
  SuccessResponse.data = status;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * Manually trigger room availability extension
 */
const manualExtendAvailabilityHandler = asyncHandler(async (req, res) => {
  await manualExtendAvailability();
  SuccessResponse.message =
    "Manual room availability extension completed successfully";
  SuccessResponse.data = {
    action: "manual_extension_completed",
  };
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

module.exports = {
  manualExtendAvailabilityHandler,
  getSchedulerStatusHandler,
  startSchedulerHandler,
  stopSchedulerHandler,
};

const Joi = require("joi");
const { FormatMessage, AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/commons");

// Define schema
const roomSchema = Joi.object({
  roomCategoryId: Joi.number().required().messages({
    "any.required": "Room category id is required",
    "number.base": "Room category id must be a number",
    "number.empty": "Room category id cannot be empty",
  }),
  dateOfAvailability: Joi.date().required().messages({
    "any.required": "Availability is required",
    "string.base": "Availability must be a date",
    "string.empty": "Availability cannot be empty",
  }),
  
});

// Middleware
function validateCreateRequest(req, res, next) {
  const { error, value } = roomSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while creating room";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

const RoomUpdateSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "Room name must be a string",
    "string.empty": "Room name cannot be empty",
  }),
  address: Joi.string().messages({
    "string.base": "Address must be a string",
    "string.empty": "Address cannot be empty",
  }),
  location: Joi.string().messages({
    "string.base": "Location must be a string",
    "string.empty": "Location cannot be empty",
  }),
});

// Middleware
function validateUpdateRequest(req, res, next) {
  const { error, value } = RoomUpdateSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while updating Room";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

module.exports = {
  validateCreateRequest,
  validateUpdateRequest
};

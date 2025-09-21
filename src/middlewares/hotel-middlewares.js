const Joi = require("joi");
const { FormatMessage, AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/commons");

// Define schema
const hotelSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Hotel name is required",
    "string.base": "Hotel name must be a string",
    "string.empty": "Hotel name cannot be empty",
  }),
  address: Joi.string().required().messages({
    "any.required": "Address is required",
    "string.base": "Address must be a string",
    "string.empty": "Address cannot be empty",
  }),
  location: Joi.string().required().messages({
    "any.required": "Location is required",
    "string.base": "Location must be a string",
    "string.empty": "Location cannot be empty",
  }),
});

// Middleware
function validateCreateRequest(req, res, next) {
  const { error, value } = hotelSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while creating hotel";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

const hotelUpdateSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "Hotel name must be a string",
    "string.empty": "Hotel name cannot be empty",
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
  const { error, value } = hotelUpdateSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while updating hotel";
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

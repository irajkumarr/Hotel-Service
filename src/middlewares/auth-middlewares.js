const { AppError } = require("../utils");
const { Auth } = require("../utils/commons");

async function checkAuth() {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Missing or invalid Authorization header",
        StatusCodes.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];
    const response = Auth.verifyToken(token);

    // Attach user info to request
    req.user = {
      id: response.id,
    };

    next();
  } catch (error) {
    throw new AppError(
      "Unauthorized: " + (error.message || "Invalid token"),
      StatusCodes.UNAUTHORIZED
    );
  }
}

module.exports = {
  checkAuth,
};

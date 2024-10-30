const appError = require("../Utilities/appError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = appError.create("log in is required", 401, "Failed", null);
    return next(error);
  }
  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.jwt_secret);
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    const wrong = appError.create(
      "wrong in authorization",
      401,
      "Failed",
      null
    );
    return next(wrong);
  }
};

module.exports = verifyToken;

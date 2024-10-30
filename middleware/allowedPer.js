const appError = require("../Utilities/appError");
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.decodedToken.role)) {
      const error = appError.create("this is not allowed", 401, "Failed", null);
      return next(error);
    }
    next();
  };
};

const multer = require("multer");
const { Error } = require("mongoose");
const appError = require("../Utilities/appError");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user - ${Date.now()}.${ext}`;
    cb(null, fileName);
  }
});

const fileFilter = function (req, file, cb) {
  const imageType = file.mimetype.split("/")[0];
  if (imageType == "image") {
    cb(null, true);
    return;
  } else {
    return cb(
      appError.create("this file is not allowed", 400, "Failed", null),
      false
    );
  }
};

module.exports = { diskStorage, fileFilter };

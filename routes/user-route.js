const { Error } = require("mongoose");
const appError = require("../Utilities/appError");
const express = require("express");
const multer = require("multer");
let usersController = require("../controller/users.control");
let verifyToken = require("../middleware/verifyToken");
const router = express.Router();
let fileControl = require("../controller/fileControl");

const upload = multer({
  storage: fileControl.diskStorage,
  fileFilter: fileControl.fileFilter
});

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

router.route("/login").post(usersController.login);

module.exports = router;

const express = require("express");
const router = express.Router();
let courses_controller = require("../controller/logic-control.js");
let verifyToken = require("../middleware/verifyToken");
let allowedPer = require("../middleware/allowedPer");
const { validationSchema } = require("../middleware/validation-schema.js");

router
  .route("/")
  .get(courses_controller.getAllCourses)
  .post(
    verifyToken,
    validationSchema(),
    allowedPer("Manager", "Admin"),
    courses_controller.createNewCourse
  );

router
  .route("/:id")
  .get(courses_controller.getSingleCourse)

  .patch(
    verifyToken,
    allowedPer("Manager", "Admin"),
    courses_controller.updateCourse
  )

  .delete(
    verifyToken,
    allowedPer("Manager", "Admin"),
    courses_controller.DeleteCourse
  );

module.exports = router;

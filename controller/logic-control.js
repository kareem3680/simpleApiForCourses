const { validationResult } = require("express-validator");
const Course = require("../models/course.models");
const asyncWrapper = require("../middleware/asyncWrapper.js");
const appError = require("../Utilities/appError");
const { Error } = require("mongoose");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: "success", data: { courses } });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    const error = appError.create("course not found", 404, "Failed", null);
    return next(error);
  }
  return res.status(200).json({ status: "success", data: { course } });
});

const createNewCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(
      "failed create",
      404,
      "Failed",
      errors.array()
    );
    return next(error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: "success", data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const updateCourse = await Course.updateOne(
    { _id: req.params.id },
    {
      $set: { ...req.body }
    }
  );
  return res.status(200).json({ status: "success", data: updateCourse });
});

const DeleteCourse = asyncWrapper(async (req, res, next) => {
  const deleteCourse = await Course.deleteOne({ _id: req.params.id });
  return res.status(200).json({ status: "success", data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createNewCourse,
  updateCourse,
  DeleteCourse
};

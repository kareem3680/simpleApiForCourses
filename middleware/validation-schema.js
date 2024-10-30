const { body } = require("express-validator");
const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is req")
      .isLength({ min: 5 })
      .withMessage("title min is req"),

    body("price")
      .notEmpty()
      .withMessage("price is req")
      .isLength({ min: 3 })
      .withMessage("price min is req")
  ];
};
module.exports = { validationSchema };

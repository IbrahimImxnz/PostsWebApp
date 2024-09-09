const { body } = require("express-validator");

const nameChecker = body("name")
  .isString()
  .withMessage("name should be a string")
  .notEmpty()
  .withMessage("fields are empty!");

module.exports = { nameChecker };

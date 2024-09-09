const { body } = require("express-validator");

const usernameChecker = body("username")
  .isString()
  .withMessage("username should be a string")
  .notEmpty()
  .withMessage("username field is empty!");

const passwordChecker = body("password")
  .isString()
  .withMessage("password should be a string")
  .notEmpty()
  .withMessage("password field is empty!");

module.exports = { usernameChecker, passwordChecker };

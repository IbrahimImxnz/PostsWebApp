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

const emailChecker = body("email")
  .isString()
  .withMessage("Email should be a string!")
  .notEmpty()
  .withMessage("Email field is empty!")
  .isEmail()
  .withMessage("Email incorrect form");

const codeChecker = body("code")
  .isNumeric()
  .withMessage("code should be a number!")
  .notEmpty()
  .withMessage("Code field is emtpy!");

module.exports = {
  usernameChecker,
  passwordChecker,
  emailChecker,
  codeChecker,
};

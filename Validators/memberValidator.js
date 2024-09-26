const { body } = require("express-validator");
const Member = require("../models/members");

const usernameChecker = body("username")
  .isString()
  .withMessage("username should be a string")
  .notEmpty()
  .withMessage("username field is empty!");

const usernameRegistrationChecker = body("username")
  .isString()
  .withMessage("username should be a string")
  .notEmpty()
  .withMessage("username field is empty!")
  .custom(async (value) => {
    const existingMember = await Member.findOne({ username: value });
    if (existingMember) {
      throw new Error("Username already in use");
    }
  }); // added due to not using .create which uses unique validation so custom validation must be created

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
  usernameRegistrationChecker,
};

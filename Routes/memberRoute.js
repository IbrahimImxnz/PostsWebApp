const express = require("express");
const memberRouter = express.Router();
const { param, body } = require("express-validator");
const {
  getMember,
  setMember,
  login,
} = require("../Controllers/memberControllers");
const validateError = require("../Validators/validator");
const { authenticateToken } = require("../jwtAuthenticator");

memberRouter
  .route("/register")
  .post(
    body("username", "password")
      .isString()
      .withMessage("username or password should be a string")
      .notEmpty()
      .withMessage("fields are empty!"),
    validateError,
    setMember
  );
memberRouter.route("/").get(
  /*
    param("id")
      .notEmpty()
      .withMessage("id is empty!")
      .isMongoId()
      .withMessage("invalid Id format!"),*/
  validateError,
  authenticateToken,
  getMember
);
memberRouter
  .route("/login")
  .post(
    body("username", "password")
      .isString()
      .withMessage("username or password should be a string")
      .notEmpty()
      .withMessage("fields are empty!"),
    validateError,
    login
  );

module.exports = memberRouter;

const express = require("express");
const memberRouter = express.Router();
const { param, body } = require("express-validator");
const {
  getMember,
  setMember,
  login,
  updateMember,
  deleteMember,
  logout,
} = require("../Controllers/memberControllers");
const validateError = require("../Validators/validator");
const {
  usernameChecker,
  passwordChecker,
} = require("../Validators/memberValidator");
const { authenticateToken } = require("../jwtAuthenticator");
const { checkToken } = require("../redisBlacklist");

memberRouter
  .route("/register")
  .post(usernameChecker, passwordChecker, validateError, setMember);

memberRouter.route("/").get(
  /*
    param("id")
      .notEmpty()
      .withMessage("id is empty!")
      .isMongoId()
      .withMessage("invalid Id format!"),*/
  validateError,
  authenticateToken,
  checkToken,
  getMember
);

memberRouter
  .route("/login")
  .post(usernameChecker, passwordChecker, validateError, login);

memberRouter
  .route("/update")
  .put(
    usernameChecker.optional(),
    passwordChecker.optional(),
    validateError,
    authenticateToken,
    updateMember
  );

memberRouter
  .route("/delete")
  .delete(validateError, authenticateToken, deleteMember);

memberRouter
  .route("/logout")
  .post(validateError, authenticateToken, checkToken, logout);

module.exports = memberRouter;

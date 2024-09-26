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
  forgotPassword,
  resetPassword,
} = require("../Controllers/memberControllers");
const validateError = require("../Validators/validator");
const {
  usernameChecker,
  passwordChecker,
  emailChecker,
  codeChecker,
} = require("../Validators/memberValidator");
const { authenticateToken } = require("../jwtAuthenticator");
const { checkToken } = require("../redisBlacklist");

memberRouter
  .route("/register")
  .post(
    usernameChecker,
    passwordChecker,
    emailChecker,
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
    checkToken,
    updateMember
  );

memberRouter
  .route("/delete")
  .delete(validateError, authenticateToken, checkToken, deleteMember);

memberRouter
  .route("/logout")
  .post(validateError, authenticateToken, checkToken, logout);

memberRouter
  .route("/forgotPassword")
  .post(emailChecker, validateError, forgotPassword);

memberRouter
  .route("/resetPassword")
  .post(
    usernameChecker,
    passwordChecker,
    codeChecker,
    validateError,
    resetPassword
  );

module.exports = memberRouter;

const express = require("express");
const memberRouter = express.Router();
const { param, body, checkExact } = require("express-validator");
const {
  getMember,
  setMember,
  login,
  updateMember,
  deleteMember,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateEmail,
  updateEmailVerify,
} = require("../Controllers/memberControllers");
const validateError = require("../Validators/validator");
const {
  usernameChecker,
  passwordChecker,
  emailChecker,
  codeChecker,
  usernameRegistrationChecker,
} = require("../Validators/memberValidator");
const { authenticateToken } = require("../jwtAuthenticator");
const { checkToken } = require("../redisBlacklist");
const sendMessage = require("../Controllers/messageControllers");

memberRouter
  .route("/verifyEmail")
  .post(emailChecker, validateError, verifyEmail);

memberRouter
  .route("/register")
  .post(
    usernameRegistrationChecker,
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
    usernameRegistrationChecker.optional(),
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

memberRouter
  .route("/verifyEmailForUpdate")
  .post(authenticateToken, checkToken, updateEmailVerify);

memberRouter
  .route("/updateEmail")
  .put(
    emailChecker.optional(),
    validateError,
    authenticateToken,
    checkToken,
    updateEmail
  );

/*memberRouter
  .route("/sendMessage")
  .post(authenticateToken, checkToken, sendMessage);
*/
module.exports = memberRouter;

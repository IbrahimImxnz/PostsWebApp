const express = require("express");
const memberRouter = express.Router();
const { param, body, checkExact } = require("express-validator");
const path = require("path");
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
  followMember,
  unfollowMember,
  getFollowingFollowers,
  getFavoritePosts,
  getMemberByUsername,
  isOnline,
  allowedTo,
  getAllMembers,
  becomeAdmin,
} = require("../Controllers/memberControllers");
const validateError = require("../Validators/validator");
const {
  usernameChecker,
  passwordChecker,
  emailChecker,
  codeChecker,
  usernameRegistrationChecker,
  usernameCheckerQuery,
} = require("../Validators/memberValidator");
const { authenticateToken } = require("../jwtAuthenticator");
const { checkToken } = require("../redisBlacklist");
const sendMessage = require("../Controllers/messageControllers");
const { nextTick } = require("process");
const { loginLimiter } = require("../rateLimit");

memberRouter
  .route("/verifyEmail")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../html_templates/verifyEmail.html"));
  })
  .post(emailChecker, validateError, verifyEmail);

memberRouter
  .route("/register")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../html_templates/register.html"));
  })
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

memberRouter.get("/selectUser", (req, res) => {
  // for loading the page
  res.sendFile(path.join(__dirname, "../html_templates/select.html"));
}); // separate sendFile from controllers and validators when the request is GET

memberRouter // for loading the script
  .route("/getUsername")
  .get(
    usernameCheckerQuery,
    validateError,
    authenticateToken,
    checkToken,
    getMemberByUsername
  );

memberRouter
  .route("/login")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../html_templates/login.html"));
  })
  .post(usernameChecker, passwordChecker, validateError, loginLimiter, login);
// , (req, res) => {  res.redirect("../html_templates/chat.html");

memberRouter
  .route("/isOnline")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../html_templates/login.html"));
  })
  .post(usernameChecker, isOnline);

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
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../html_templates/logout.html"));
  })
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

memberRouter
  .route("/followMember")
  .post(
    usernameChecker,
    validateError,
    authenticateToken,
    checkToken,
    followMember
  );

memberRouter
  .route("/unfollowMember")
  .post(
    usernameChecker,
    validateError,
    authenticateToken,
    checkToken,
    unfollowMember
  );

memberRouter
  .route("/getFollowersFollowing")
  .get(authenticateToken, checkToken, getFollowingFollowers);

memberRouter
  .route("/getFavoritePosts")
  .get(authenticateToken, checkToken, getFavoritePosts);

memberRouter
  .route("/becomeAdmin")
  .put(usernameChecker, authenticateToken, checkToken, becomeAdmin);

memberRouter.use(authenticateToken, checkToken, allowedTo("admin"));
memberRouter
  .route("/getAllMembers")
  .get(authenticateToken, checkToken, getAllMembers);

/*memberRouter
  .route("/sendMessage")
  .post(authenticateToken, checkToken, sendMessage);
*/
module.exports = memberRouter;

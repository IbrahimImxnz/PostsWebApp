const express = require("express");
const sectionRouter = express.Router();
const { param, body } = require("express-validator");
const {
  getSection,
  setSection,
  updateSection,
  getAllSections,
} = require("../Controllers/sectionControllers");
const validateError = require("../Validators/validator");
const { authenticateToken } = require("../jwtAuthenticator");
const { nameChecker } = require("../Validators/sectionValidator");
const { checkToken } = require("../redisBlacklist");

sectionRouter
  .route("/")
  .post(nameChecker, validateError, authenticateToken, checkToken, setSection);

sectionRouter.route("/").get(
  /*
    param("id")
      .notEmpty()
      .withMessage("id is empty!")
      .isMongoId()
      .withMessage("invalid Id format!"),*/
  validateError,
  authenticateToken,
  checkToken,
  getSection
);

sectionRouter
  .route("/update")
  .put(
    nameChecker,
    validateError,
    authenticateToken,
    checkToken,
    updateSection
  );

sectionRouter.route("/AllSections").get(getSection);

module.exports = sectionRouter;

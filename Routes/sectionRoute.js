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

sectionRouter
  .route("/")
  .post(nameChecker, validateError, authenticateToken, setSection);

sectionRouter.route("/").get(
  /*
    param("id")
      .notEmpty()
      .withMessage("id is empty!")
      .isMongoId()
      .withMessage("invalid Id format!"),*/
  validateError,
  authenticateToken,
  getSection
);

sectionRouter
  .route("/update")
  .put(nameChecker, validateError, authenticateToken, updateSection);

sectionRouter.route("/AllSections").get(getSection);

module.exports = sectionRouter;

const express = require("express");
const sectionRouter = express.Router();
const { param, body } = require("express-validator");
const { getSection, setSection } = require("../Controllers/sectionControllers");
const validateError = require("../Validators/validator");
const { authenticateToken } = require("../jwtAuthenticator");

sectionRouter
  .route("/")
  .post(
    body("name")
      .isString()
      .withMessage("name should be a string")
      .notEmpty()
      .withMessage("fields are empty!"),
    validateError,
    authenticateToken,
    setSection
  );
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

module.exports = sectionRouter;

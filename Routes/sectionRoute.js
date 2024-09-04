const express = require("express");
const sectionRouter = express.Router();
const { param, body } = require("express-validator");
const { getSection, setSection } = require("../Controllers/sectionControllers");
const validateError = require("../validator");

sectionRouter
  .route("/")
  .post(
    body("name")
      .isString()
      .withMessage("name should be a string")
      .notEmpty()
      .withMessage("fields are empty!"),
    validateError,
    setSection
  );
sectionRouter
  .route("/:id")
  .get(
    param("id")
      .notEmpty()
      .withMessage("id is empty!")
      .isMongoId()
      .withMessage("invalid Id format!"),
    validateError,
    getSection
  );

module.exports = sectionRouter;
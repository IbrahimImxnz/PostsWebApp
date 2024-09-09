const { body } = require("express-validator");

const checkTitle = body("title")
  .isString()
  .withMessage("title should be a string")
  .notEmpty()
  .withMessage("title field is empty!");

const checkText = body("text")
  .isString()
  .withMessage("text should be a string")
  .notEmpty()
  .withMessage("text field is empty!");

const checkSectionId = body("section_id")
  .notEmpty()
  .withMessage("Id is empty!")
  .isMongoId()
  .withMessage("Id format is incorrect!");

module.exports = { checkText, checkTitle, checkSectionId };

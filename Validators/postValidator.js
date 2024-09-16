const { body, query } = require("express-validator");

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

const checkTitleQuery = query("title")
  .notEmpty()
  .withMessage("title field is empty!");

const checkSectionIdQuery = query("section_id")
  .notEmpty()
  .withMessage("Id is empty!")
  .isMongoId()
  .withMessage("Id format is incorrect!");

const checkIdQuery = query("id")
  .notEmpty()
  .withMessage("Id is empty!")
  .isMongoId()
  .withMessage("Id format is incorrect!");

module.exports = {
  checkText,
  checkTitle,
  checkSectionId,
  checkSectionIdQuery,
  checkTitleQuery,
  checkIdQuery,
};

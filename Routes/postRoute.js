const express = require("express");
const postRouter = express.Router();
const { param, body } = require("express-validator");
const {
  getPost,
  setPost,
  getPostByTitle,
  getPostBySection,
} = require("../Controllers/postControllers");
const validateError = require("../validator");
const { authenticateToken } = require("../jwtAuthenticator");

postRouter
  .route("/")
  .post(
    body("title", "text")
      .isString()
      .withMessage("title or text should be a string")
      .notEmpty()
      .withMessage("fields are empty!"),
    body("section_id")
      .notEmpty()
      .withMessage("Ids are empty!")
      .isMongoId()
      .withMessage("Id formats are incorrect!"),
    validateError,
    authenticateToken,
    setPost
  );

postRouter.route("/").get(
  /*
    param("id")
      .notEmpty()
      .withMessage("id is empty!")
      .isMongoId()
      .withMessage("invalid Id format!"),*/
  validateError,
  authenticateToken,
  getPost
);

postRouter
  .route("/title/:title")
  .get(validateError, authenticateToken, getPostByTitle);

postRouter
  .route("/section/:section")
  .get(validateError, authenticateToken, getPostBySection);

module.exports = postRouter;

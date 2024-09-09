const express = require("express");
const postRouter = express.Router();
const {
  getPost,
  setPost,
  getPostByTitle,
  getPostBySection,
  updatePost,
  deletePost,
} = require("../Controllers/postControllers");
const validateError = require("../Validators/validator");
const {
  checkSectionId,
  checkText,
  checkTitle,
} = require("../Validators/postValidator");

const { authenticateToken } = require("../jwtAuthenticator");

postRouter
  .route("/")
  .post(
    checkTitle,
    checkText,
    checkSectionId,
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

postRouter
  .route("/update/:id")
  .put(
    checkTitle.optional(),
    checkText.optional(),
    checkSectionId.optional(),
    validateError,
    authenticateToken,
    updatePost
  );

postRouter
  .route("/delete/:id")
  .delete(validateError, authenticateToken, deletePost);

module.exports = postRouter;

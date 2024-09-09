const express = require("express");
const postRouter = express.Router();
const {
  getPost,
  setPost,
  getPostByTitle,
  getPostBySection,
  updatePost,
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

postRouter.route("/update/:id").put(
  checkTitle, //.optional({ values: "falsy" }),
  checkText, //.optional({ values: "falsy" }),
  checkSectionId, //.optional({ values: "falsy" }),
  validateError,
  authenticateToken,
  updatePost
);

module.exports = postRouter;

const express = require("express");
const postRouter = express.Router();
const {
  getPost,
  setPost,
  //getPostByTitle,
  //getPostBySection,
  updatePost,
  deletePost,
} = require("../Controllers/postControllers");
const validateError = require("../Validators/validator");
const {
  checkSectionId,
  checkText,
  checkTitle,
  checkSectionIdQuery,
  checkTitleQuery,
  checkIdQuery,
} = require("../Validators/postValidator");

const { authenticateToken } = require("../jwtAuthenticator");
const { checkToken } = require("../redisBlacklist");

postRouter
  .route("/")
  .post(
    checkTitle,
    checkText,
    checkSectionId,
    validateError,
    authenticateToken,
    checkToken,
    setPost
  );

postRouter.route("/").get(
  /*
    param("id")
      .notEmpty()
      .withMessage("id is empty!")
      .isMongoId()
      .withMessage("invalid Id format!"),*/
  checkSectionIdQuery.optional(),
  checkTitleQuery.optional(),
  checkIdQuery.optional(),
  validateError,
  authenticateToken,
  checkToken,
  getPost
);
/*
postRouter
  .route("/title/:title")
  .get(validateError, authenticateToken, checkToken, getPostByTitle);

postRouter
  .route("/section/:section")
  .get(validateError, authenticateToken, checkToken, getPostBySection);
*/
postRouter
  .route("/update/:id")
  .put(
    checkTitle.optional(),
    checkText.optional(),
    checkSectionId.optional(),
    validateError,
    authenticateToken,
    checkToken,
    updatePost
  );

postRouter
  .route("/delete/:id")
  .delete(validateError, authenticateToken, checkToken, deletePost);

module.exports = postRouter;

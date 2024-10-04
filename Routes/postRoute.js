const express = require("express");
const postRouter = express.Router();
const {
  getPost,
  setPost,
  //getPostByTitle,
  //getPostBySection,
  updatePost,
  deletePost,
  favoritePost,
  unfavoritePost,
} = require("../Controllers/postControllers");
const validateError = require("../Validators/validator");
const {
  checkSectionId,
  checkText,
  checkTitle,
  checkSectionIdQuery,
  checkTitleQuery,
  checkIdQuery,
  checkMemberId,
} = require("../Validators/postValidator");

const { authenticateToken } = require("../jwtAuthenticator");
const { checkToken } = require("../redisBlacklist");
const { checkExact } = require("express-validator");

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
  /* validateError,
  authenticateToken,
  checkToken,*/ // i want anyone to be able to view posts
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

postRouter
  .route("/favoritePost/:id")
  .post(
    checkTitle,
    checkMemberId,
    validateError,
    authenticateToken,
    checkToken,
    favoritePost
  );

postRouter
  .route("/unfavoritePost/:id")
  .post(
    checkTitle,
    checkMemberId,
    validateError,
    authenticateToken,
    checkToken,
    unfavoritePost
  );

module.exports = postRouter;

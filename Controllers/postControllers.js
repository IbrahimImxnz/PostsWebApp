const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const { validationResult } = require("express-validator");
const Member = require("../models/members");
const messages = require("../models/messages");
/*
const getPost = asyncHandler(async (req, res) => {
  /*const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({success : false, message : result.array()})
    }*/
/*const post = await Post.findById(req.params.id)
    .populate("member_id")
    .populate("section_id");*/
/*const post = await Post.find({ member_id: req.userid })
    .populate("member_id")
    .populate("section_id");
  if (!post)
    return res.status(404).json({ success: false, message: "post not found" });
  res.json({ post });
});
// todo add getspecificpost
// todo getpostbysection
// todo add put and logout functions and delete
const getPostByTitle = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    member_id: req.userid,
    title: req.params.title,
  })
    .populate("member_id")
    .populate("section_id");
  if (!post)
    return res.status(404).json({ success: false, message: "Post not found" });
  res.json({ post });
  if (!req.params.title)
    return res.status(404).json({ success: false, message: "Title not found" });
});

const getPostBySection = asyncHandler(async (req, res) => {
  const post = await Post.find({
    member_id: req.userid,
    section_id: req.params.section,
  })
    .populate("member_id")
    .populate("section_id");

  if (!post)
    return res
      .status(404)
      .json({ success: false, message: "Post Section not found" });
  res.json({ post });
  if (!req.params.section)
    return res
      .status(404)
      .json({ success: false, message: "Section not found" });
});*/

// todo a better way is to use query params

const getPost = asyncHandler(async (req, res) => {
  const { section_id, title, id } = req.query;
  let query = { member_id: req.userid };

  if (section_id) query.section_id = section_id;

  if (title) query.title = title;

  if (id) query.id = id;

  const post = await Post.find(query)
    .populate({ path: "member_id", select: "username" })
    .populate("section_id");

  if (!post || post.length == 0)
    return res
      .status(404)
      .json({ success: false, message: "Could not fetch post" });

  res.json({ success: true, data: post, message: "Post fetched" });
});

const setPost = asyncHandler(async (req, res) => {
  const { title, text, section_id } = req.body;
  /*const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({ success : false, message : result.array()})
    }*/
  const post = await Post.create({
    title: title,
    text: text,
    member_id: req.userid,
    section_id: section_id,
  });
  res.status(201).json(post); // todo change 200 to 201
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, text, section_id } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post)
    return res.status(404).json({ success: false, message: "post not found" });
  // could use findByIdAndUpdate
  if (title) post.title = title;
  if (text) post.text = text;
  if (section_id) post.section_id = section_id;

  await post.save();

  res.json({ success: true, data: post, message: "Post updated successfully" });
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post)
    return res.status(404).json({ success: false, message: "Post not found" });

  // await post.remove();
  res.json({ success: true, data: post, message: "post deleted" });
});

const favoritePost = asyncHandler(async (req, res) => {
  // const title = req.body;
  // const member_id = req.params;
  const { title, member_id } = req.query;
  let query = {};

  query.title = title;
  query.member_id = member_id;

  const post = await Post.findOne(query);
  const you = await Member.findById(req.userid);

  if (!post)
    return res.status(404).json({ success: false, message: "Post not found" });
  if (you.favorites.some((id) => id.equals(post._id)))
    // returns true or false wether array has that id or no
    return res
      .status(400)
      .json({ success: false, message: "You already favorite this post!" });

  await Member.findByIdAndUpdate(req.userid, {
    $push: { favorites: post._id },
  });

  const likedPost = await Post.findById(post._id)
    .populate({
      path: "member_id",
      select: "username",
    })
    .populate({ path: "section_id", select: "name" });

  await Post.findByIdAndUpdate(post._id, {
    $push: { favorited: req.params.id },
  });

  res.json({ success: true, data: likedPost, message: "Post favorited" });
});

const unfavoritePost = asyncHandler(async (req, res) => {
  const { title, member_id } = req.query;
  let query = {};

  query.title = title;
  query.member_id = member_id;

  const post = await Post.findOne(query);

  if (!post)
    return res.status(404).json({ success: false, message: "Post not found" });
  if (!you.favorites.some((id) => id.equals(post._id)))
    // returns true or false wether array has that id or no
    return res
      .status(400)
      .json({ success: false, message: "You never favorited this post!" });

  await Member.findByIdAndUpdate(req.userid, {
    $pull: { favorites: post._id },
  });

  const unlikedPost = await Post.findById(post._id)
    .populate({
      path: "member_id",
      select: "username",
    })
    .populate({ path: "section_id", select: "name" });

  await Post.findByIdAndUpdate(post._id, {
    $pull: { favorited: req.params.id },
  });

  res.json({ success: true, data: unlikedPost, message: "Post unfavorited" });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();

  if (!posts)
    return res.status(404).json({ success: false, message: "No posts found" });

  res.json({ success: true, data: posts, message: "All posts" });
});

module.exports = {
  getPost,
  setPost,
  //getPostByTitle,
  //getPostBySection,
  updatePost,
  deletePost,
  favoritePost,
  unfavoritePost,
  getAllPosts,
};

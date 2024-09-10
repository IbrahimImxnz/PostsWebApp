const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const { validationResult } = require("express-validator");

const getPost = asyncHandler(async (req, res) => {
  /*const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({success : false, message : result.array()})
    }*/
  /*const post = await Post.findById(req.params.id)
    .populate("member_id")
    .populate("section_id");*/
  const post = await Post.find({ member_id: req.userid })
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

module.exports = {
  getPost,
  setPost,
  getPostByTitle,
  getPostBySection,
  updatePost,
  deletePost,
};

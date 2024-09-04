const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const { validationResult } = require("express-validator");

const getPost = asyncHandler(async (req, res) => {
  /*const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({success : false, message : result.array()})
    }*/
  const post = await Post.findById(req.params.id)
    .populate("member_id")
    .populate("section_id");
  if (!post) return res.status(404).send("Post not found");
  res.json({ post });
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

module.exports = { getPost, setPost };

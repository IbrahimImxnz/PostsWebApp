const asyncHandler = require("express-async-handler");
const Section = require("../models/sections");
const { validationResult } = require("express-validator");

const getSection = asyncHandler(async (req, res) => {
  /*const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({success : false, message : result.array()})
    }*/
  //const section = await Section.findById(req.params.id);
  const section = await Section.find({ created_by: req.userid }).populate({
    path: "created_by",
    select: "username",
  });

  if (!section)
    return res
      .status(404)
      .json({ success: false, message: "Section not found" });
  res.json({ success: true, data: section, message: "sections found" });
});

const getAllSections = asyncHandler(async (req, res) => {
  const sections = Section.find({}).populate({
    path: "created_by",
    select: "username",
  });
  if (sections.isEmpty())
    return res
      .status(404)
      .json({ success: false, message: "No sections created yet" });

  res.json({ success: true, data: sections, message: "All sections found" });
});

const setSection = asyncHandler(async (req, res) => {
  /*const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({ success : false, message : result.array()})
    }*/
  const section = await Section.create({
    name: req.body.name,
    created_by: req.userid,
  });
  res.status(200).json(section);
});

const updateSection = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.id);
  if (!section)
    return res
      .status(404)
      .json({ success: false, message: "could not find section" });
  if (req.body.name) section.name = req.body.name;

  await section.save();

  res.json({
    success: true,
    data: section,
    message: "section updated successfully",
  });
});

module.exports = { getSection, setSection, updateSection, getAllSections };

// todo use query parameters for get all to avoid having too many get requests

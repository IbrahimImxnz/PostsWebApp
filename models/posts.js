const mongoose = require("mongoose")
const Member = require("../models/members")
const Section = require("../models/sections")

const postSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 20,
    },
    text : {
        type : String,
        required : true,
        minlength : 20,
        maxlength : 200, 
    },
    member_id : {
        type : mongoose.Types.ObjectId,
        ref : Member,
    },
    section_id : {
        type : mongoose.Types.ObjectId,
        ref : Section,
    },
}, {timestamps:true})

module.exports = mongoose.model("Post", postSchema)

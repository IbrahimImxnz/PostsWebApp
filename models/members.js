const mongoose = require("mongoose")

const memberSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true, 
    }

}, {timestamps:true})

module.exports = mongoose.model("Member", memberSchema)



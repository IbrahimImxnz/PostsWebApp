const mongoose = require("mongoose")

const sectionSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        enum : {
            values : ["Sport", "Entertainment", "Food", "Politics"],
            message : "Please only choose from following options: (Sport, Entertainment, Food, Politics)"
        }
    }
})

module.exports = mongoose.model("Section", sectionSchema)

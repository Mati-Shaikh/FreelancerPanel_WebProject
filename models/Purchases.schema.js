const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    ProjectId:String,
    UserId:String,// who has bought project

},{timestamps:true})
const model = mongoose.model("Purchases" , userSchema);
module.exports = model;


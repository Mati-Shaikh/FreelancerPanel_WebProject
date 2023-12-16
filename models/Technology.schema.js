const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    Title :String,
    Description:String,
},{timestamps:true})
const model = mongoose.model("Technology" , userSchema);
module.exports = model;


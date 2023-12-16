const mongoose = require("mongoose")

const commentobj = new mongoose.Schema({
    commentText: String,
    Username:String,
    UserId:String,
  });

const responseSchema = mongoose.Schema({
    UserId :String,
    Username :String,
    Blogdata:String,
    Disabled:Boolean,
    Reason:String,
    Rating:Number,
    NumberofRatings:Number,
    Accounttitle:String,
    Keywords:[String],
    Category:[String],
    Comments: [commentobj],
    // Image:String,
    // url:String,
},{timestamps:true})
const model = mongoose.model("Blog" , responseSchema);
module.exports = model;

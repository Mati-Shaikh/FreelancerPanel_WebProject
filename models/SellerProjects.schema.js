const mongoose = require("mongoose")

const reviews = new mongoose.Schema({
    UserId:String,//User That has given review
    Comment:String,
    Rating:Number,
  });
const userSchema = mongoose.Schema({
    Title: String,
    ImageUrl:[String],
    ImagePaths:[String],
    Description:String,
    Technologies:[String],
    TotalRating:Number,
    TotalNumberofFeddbacks:Number,
    Sales:Number,
    Price:Number,
    Revenue:Number,
    Feedbacks:[reviews],
},{timestamps:true})
const model = mongoose.model("SellerProjects" , userSchema);
module.exports = model;


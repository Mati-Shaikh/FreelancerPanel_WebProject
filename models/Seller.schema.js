const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    FullName :String,
    Email:String,
    Role:String,
    TotalRating:Number,
    TotalNumberofFeddbacks:Number,
    Password:String,
    Blocked:Boolean,
    Reason:String,
    Specialities:[String],
    AccountBalance:Number
},{timestamps:true})
const model = mongoose.model("Seller" , userSchema);
module.exports = model;


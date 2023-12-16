const mongoose = require("mongoose")
const notificationSchema = mongoose.Schema({
    GeneratedByUserId:String,
    GeneratedForUserId:String,
    Message :String,
},{timestamps:true})
const model = mongoose.model("Notification" , notificationSchema);
module.exports = model;


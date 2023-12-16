const mongoose = require("mongoose")

  const chat = new mongoose.Schema({
    Text: String,
    Username:String,
    UserId:String,
    Time:String,
  });
//Chat:[chat],
const responseSchema = mongoose.Schema({
  projectId: 
  {
    type: String,
    unique: true, // Ensures uniqueness
    default: () => {
        // Generates a unique ID using a library like uuid or any other method
        // Example using uuid:
        const uuid = require('uuid');
        return uuid.v4();}
  },  
    Deadline:String,//deadline of project
    Title:String,//titile of project 
    Requirements:String,//requirnment related to  project 
    Description:String,//detail description of project 
    Budget:Number,//estimated budget foe project
    UserId :String,//Userid who is uploading it (Customer)
    Username :String,  //User who is uploading it (Customer)
    Assigned:String,   //UserId of the freelancer to wchich project is assigned
    AssignedUsername:String,//Username of the freelancer to wchich project is assigned
    Status:String,//WAITING FOR APPROVAL,REJECTED,WORKING,COMPLETED
    Paid:Number,//cost paid for project
    Tip:Number,//tip paid for project 
    PaidOnDate:String,//date
    Keywords:[String],//TECHNOLOGIES LIKE C++/JAVA ETC
  
},{timestamps:true})
const model = mongoose.model("Projects" , responseSchema);
module.exports = model;
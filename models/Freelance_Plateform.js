const mongoose = require("mongoose");

const sampleprojects = new mongoose.Schema({
  Title: String,
  ImageUrl: [String],
  ImagePaths: [String],
  Description: String,
  Technologies: [String],
});

const userSchema = mongoose.Schema({
  FullName: {
    type: String,
    default: "", // Default value for FullName
  },
  Email: {
    type: String,
    default: "", // Default value for Email
  },
  TotalRating: {
    type: Number,
    default: 0, // Default value for TotalRating
  },
  AvgRating: {
    type: Number,
    default: 0, // Default value for AvgRating
  },
  TotalNumberofFeddbacks: {
    type: Number,
    default: 0, // Default value for TotalNumberofFeddbacks
  },
  Password: {
    type: String,
    default: "", // Default value for Password
  },
  Blocked: {
    type: Boolean,
    default: false, // Default value for Blocked
  },
  Reason: {
    type: String,
    default: "", // Default value for Reason
  },
  Specialities: {
    type: [String],
    default: [], // Default value for Specialities
  },
  AccountBalance: {
    type: Number,
    default: 0, // Default value for AccountBalance
  },
  FreeRivisions: {
    type: Number,
    default: 0, // Default value for FreeRivisions
  },
  Notifications: [
    {
      message: {
        type: String,
        default: "", // Default value for Notifications.message
      },
      createdAt: {
        type: Date,
        default: Date.now, // Default value for Notifications.createdAt
      },
    },
  ],
  RivisionCost: {
    type: Number,
    default: 0, // Default value for RivisionCost
  },
  Samples: [sampleprojects],
}, { timestamps: true });

const model = mongoose.model("Freelance", userSchema);
module.exports = model;

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const Freelancer = require("./routes/Freelencer")
const cors=require("cors");
dotenv.config();
app.use(express.json());
//app.use(cors({origin:"*"}))
app.use(cors());
mongoose
  .connect(process.env.MONGODB_STRING, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB----");
  })
  .catch((err) => console.error(err)); 

  
app.use("/api/auth", authRoute);
app.use("/api/Freelancer", Freelancer);

app.listen("3000", () => {
  console.log("Backend is running.");
});


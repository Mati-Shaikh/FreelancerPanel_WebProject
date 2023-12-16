const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Freelance = require('../models/Freelance_Plateform')

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    FullName: user.FullName,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

let RegisterUser = async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.Password, salt);
      const newUser = new Freelance({
        FullName: req.body.FullName,
        Email: req.body.Email,
        Password: hashedPass,
        Specialities: req.body.Specialities,
      });
  
      const user = await Freelance.create(newUser);

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  let LoginUser = async (req, res) => {
    try {
      const user = await Freelance.findOne({ Email: req.body.Email });
      !user && res.status(400).json("Wrong credentials!");
  
      const validated = await bcrypt.compare(req.body.Password, user.Password);
      !validated && res.status(400).json("Wrong credentials!");
  
      const token = generateToken(user);
  
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, token });
    } catch (err) {
      res.status(500).json(err);
    }
  };

module.exports = {RegisterUser,LoginUser};
const router = require("express").Router();
const verifyToken = require("./authentication");

const {RegisterUser, LoginUser} = require('../Controller/auth_api')

 router.post('/register', RegisterUser);
 router.post('/login', LoginUser);
 



module.exports = router;
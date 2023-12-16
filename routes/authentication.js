const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json("Access denied");

    let decoded;
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Access _id and FullName from the decoded token
    const { _id, FullName } = decoded;
    //console.log(_id)
    //console.log(FullName)
    // Store user information in res.locals for further use in the route handlers
    res.locals.userId = _id;
    res.locals.userFullName = FullName;
    //console.log(res.locals.userId);
    //console.log(res.locals.userFullName);


    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token error in verifyToken middleware:', error);
      return res.status(401).json('Invalid token');
    } else {
      console.error('Error in verifyToken middleware:', error);
      return res.status(500).json('Internal Server Error');
    }
  }
};

module.exports = verifyToken;

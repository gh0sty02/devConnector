const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // get the token from header
  const token = req.header("x-auth-token");
  // check if token exists
  if (!token) {
    return res.status(401).json({
      msg: "no Token, Authorization denied",
    });
  }

  try {
    // if yes, decode it and store it
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({
      msg: "Invalid Token",
    });
  }
};

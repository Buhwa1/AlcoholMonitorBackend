const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      message: "Token not provided",
      status: "FAIL",
      details: "No authorization token was found",
    });
  }

  jwt.verify(token, "monitor@userapp", (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Token is invalid",
        status: "FAIL",
        details: "The provided token is not valid",
      });
    }
    req.user = user;
    res.send(user);
    next();
  });
};

module.exports = authenticationToken;

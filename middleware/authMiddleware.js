const jwt = require("jsonwebtoken");
const { blacklistedTokens } = require("../controllers/apiController");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token required" });

  const token = authHeader.split(" ")[1];
  if (blacklistedTokens.includes(token))
    return res.status(401).json({ error: "Token is blacklisted" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

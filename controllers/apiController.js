const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const { expensiveFunction } = require("../services/expensiveService");
const { binomialRand } = require("../utils/randomGen");
const {
  cache,
  trackLatency,
  getP90,
  getStats,
  resetLatencies,
  resetCache,
} = require("../utils/cache");

const blacklistedTokens = [];

exports.login = (req, res) => {
  const user = { id: 1, username: "admin" };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};

exports.logout = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) blacklistedTokens.push(token);
  res.json({ message: "Logged out" });
};

exports.expensiveRoute = async (req, res) => {
  const input = parseInt(req.params.input);
  const start = Date.now();
  let result;
  let cacheStatus;

  if (cache.has(input)) {
    result = cache.get(input);
    cacheStatus = "HIT";
  } else {
    result = await expensiveFunction(input);
    cache.set(input, result);
    cacheStatus = "MISS";
  }

  const latency = Date.now() - start;
  trackLatency(latency);
  res.json({ result, cache: cacheStatus, latency });
};

exports.runTest = async (req, res) => {
  resetLatencies();
  const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

  for (let i = 0; i < 1000; i++) {
    const val = binomialRand();
    await fetch(`http://localhost:5000/api/expensive/${val}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const p90 = getP90();
  res.json({ message: "Test complete", p90 });
};

exports.cacheStats = (req, res) => {
  res.json(getStats());
};

exports.resetCache = (req, res) => {
  resetCache();
  res.json({ message: "Cache cleared" });
};

exports.blacklistedTokens = blacklistedTokens;

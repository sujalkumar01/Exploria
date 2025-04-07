const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  login,
  logout,
  expensiveRoute,
  runTest,
  cacheStats,
  resetCache,
} = require("../controllers/apiController");

router.post("/login", login);
router.post("/logout", logout);
router.get("/expensive/:input", authMiddleware, expensiveRoute);
router.get("/run-tests", runTest);
router.get("/cache-stats", cacheStats);
router.post("/reset-cache", resetCache);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getYearlyAnalytics,
  getCategorySummary
} = require("../controllers/analyticsController");

router.get("/weekly", getWeeklyAnalytics);
router.get("/monthly", getMonthlyAnalytics);
router.get("/yearly", getYearlyAnalytics);
router.get("/category-summary", getCategorySummary);


module.exports = router;

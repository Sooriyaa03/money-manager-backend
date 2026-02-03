const express = require("express");
const router = express.Router();
const {
  addTransaction,
  updateTransaction,
  getTransactions,
  transferAmount
} = require("../controllers/transactionController");

router.post("/", addTransaction);
router.post("/transfer", transferAmount);
router.put("/:id", updateTransaction);
router.get("/", getTransactions);

module.exports = router;

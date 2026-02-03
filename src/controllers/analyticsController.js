const Transaction = require("../models/Transaction");

// helper
const getIncomeExpense = async (start, end) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        type: { $in: ["income", "expense"] },
        createdAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  let income = 0;
  let expense = 0;

  result.forEach(item => {
    if (item._id === "income") income = item.total;
    if (item._id === "expense") expense = item.total;
  });

  return { income, expense };
};

// WEEKLY
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 7);

    const data = await getIncomeExpense(start, now);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MONTHLY
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const data = await getIncomeExpense(start, now);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// YEARLY
exports.getYearlyAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);

    const data = await getIncomeExpense(start, now);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategorySummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $match: { type: "expense" }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

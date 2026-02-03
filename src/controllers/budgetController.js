const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Set or update budget
exports.setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { category },
      { limit },
      { upsert: true, new: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get budget status
exports.getBudgetStatus = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1); // first day of month

    const expenses = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          createdAt: { $gte: start }
        }
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" }
        }
      }
    ]);

    const budgets = await Budget.find();

    const result = budgets.map((b) => {
      const match = expenses.find((e) => e._id === b.category);
      const spent = match ? match.spent : 0;

      return {
        category: b.category,
        limit: b.limit,
        spent,
        exceeded: spent > b.limit,
        percentage: Math.round((spent / b.limit) * 100)
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

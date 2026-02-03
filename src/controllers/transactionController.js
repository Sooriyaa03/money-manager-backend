const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      division,
      account,
      description
    } = req.body;

    // Basic validation
    if (!type || !amount) {
      return res.status(400).json({ message: "Type and amount are required" });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const transaction = await Transaction.create({
      type,
      amount,
      category,
      division,
      account,
      description
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 12-hour rule
    const HOURS_12 = 12 * 60 * 60 * 1000;
    const now = Date.now();
    const createdTime = new Date(transaction.createdAt).getTime();

    if (now - createdTime > HOURS_12) {
      return res.status(403).json({
        message: "Editing is restricted after 12 hours"
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      division,
      account,
      startDate,
      endDate
    } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (division) filter.division = division;
    if (account) filter.account = account;

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(filter).sort({
      createdAt: -1
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.transferAmount = async (req, res) => {
  try {
    const { amount, fromAccount, toAccount, description } = req.body;

    if (!amount || !fromAccount || !toAccount) {
      return res.status(400).json({
        message: "Amount, fromAccount and toAccount are required"
      });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({
        message: "From and To accounts cannot be the same"
      });
    }

    const transfer = await Transaction.create({
      type: "transfer",
      amount,
      fromAccount,
      toAccount,
      description
    });

    res.status(201).json({
      message: "Transfer successful",
      transaction: transfer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


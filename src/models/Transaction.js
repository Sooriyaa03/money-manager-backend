const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: function () {
        return this.type !== "transfer";
      }
    },

    division: {
      type: String,
      enum: ["office", "personal"],
      required: function () {
        return this.type !== "transfer";
      }
    },

    account: {
      type: String,
      required: function () {
        return this.type !== "transfer";
      }
    },

    fromAccount: {
      type: String
    },

    toAccount: {
      type: String
    },

    description: {
      type: String,
      trim: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);

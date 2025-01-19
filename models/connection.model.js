const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    connectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

ConnectionSchema.index({ from: 1, to: 1 });
ConnectionSchema.index({ status: 1 });

const Connection = mongoose.model("Connection", ConnectionSchema);

module.exports = Connection;

const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Scam/Fraud",
        "Inappropriate Content",
        "Incorrect Information",
        "Duplicate Listing",
        "Prohibited Item",
        "Other",
      ],
    },
    description: { type: String, trim: true, maxLength: 500 },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true },
);
reportSchema.index({ listing: 1, reporter: 1 }, { unique: true });
module.exports = mongoose.model("Report", reportSchema);

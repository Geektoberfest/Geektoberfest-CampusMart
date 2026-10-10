const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxLength: 100 },
    description: { type: String, required: true, trim: true, maxLength: 2000 },
    category: {
      type: String,
      required: true,
      enum: [
        "Books",
        "Electronics",
        "Calculators",
        "Furniture",
        "Stationery",
        "Lab Equipment",
        "Clothing",
        "Accessories",
        "Other",
      ],
    },
    price: { type: Number, required: true, min: 0 },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair"],
    },
    images: { type: [String], default: [] },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Available", "Sold"], default: "Available" },
  },
  { timestamps: true },
);
itemSchema.index({ title: "text", description: "text", category: "text" });
itemSchema.index({ category: 1, status: 1, price: 1, createdAt: -1 });
module.exports = mongoose.model("Item", itemSchema);

const Item = require("../models/Item");
const { ok, fail } = require("../utils/response");
const fs = require("fs");
const path = require("path");
const clean = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  department: u.department,
  year: u.year,
});
exports.getItems = async (req, res) => {
  const {
    search,
    category,
    condition,
    status = "Available",
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 12,
  } = req.query;
  const q = {};
  if (status !== "all") q.status = status;
  if (category) q.category = category;
  if (condition) q.condition = condition;
  if (search) q.$text = { $search: search };
  if (minPrice || maxPrice)
    q.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  const sorts = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
  };
  const p = Math.max(1, Number(page)),
    l = Math.min(50, Math.max(1, Number(limit)));
  const total = await Item.countDocuments(q);
  const items = await Item.find(q)
    .populate("seller", "name email department year")
    .sort(sorts[sort] || sorts.newest)
    .skip((p - 1) * l)
    .limit(l);
  ok(res, 200, "Listings fetched.", {
    listings: items,
    currentPage: p,
    totalPages: Math.ceil(total / l),
    totalItems: total,
  });
};
exports.getItem = async (req, res) => {
  const item = await Item.findById(req.params.id).populate(
    "seller",
    "name email department year",
  );
  if (!item) return fail(res, 404, "Listing not found.");
  ok(res, 200, "Listing fetched.", { item });
};
exports.createItem = async (req, res) => {
  const { title, description, category, price, condition, location } = req.body;
  if (
    !title ||
    !description ||
    !category ||
    price === undefined ||
    !condition ||
    !location
  )
    return fail(res, 400, "All listing fields are required.");
  if (Number(price) < 0 || Number.isNaN(Number(price)))
    return fail(res, 400, "Price must be a valid non-negative number.");
  if (!req.files?.length)
    return fail(res, 400, "At least one image is required.");
  const images = req.files.map((f) => `/uploads/${f.filename}`);
  const item = await Item.create({
    title,
    description,
    category,
    price: Number(price),
    condition,
    location,
    images,
    seller: req.user._id,
  });
  await item.populate("seller", "name email department year");
  ok(res, 201, "Listing created successfully.", { item });
};
exports.updateItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return fail(res, 404, "Listing not found.");
  if (String(item.seller) !== String(req.user._id) && !req.user.isAdmin)
    return fail(res, 403, "You can only edit your own listing.");
  const allowed = [
    "title",
    "description",
    "category",
    "price",
    "condition",
    "location",
  ];
  for (const k of allowed) if (req.body[k] !== undefined) item[k] = req.body[k];
  if (
    req.body.price !== undefined &&
    (Number(req.body.price) < 0 || Number.isNaN(Number(req.body.price)))
  )
    return fail(res, 400, "Price must be valid.");
  if (req.files?.length)
    item.images.push(...req.files.map((f) => `/uploads/${f.filename}`));
  await item.save();
  await item.populate("seller", "name email department year");
  ok(res, 200, "Listing updated successfully.", { item });
};
exports.deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return fail(res, 404, "Listing not found.");
  if (String(item.seller) !== String(req.user._id) && !req.user.isAdmin)
    return fail(res, 403, "You can only delete your own listing.");
  await item.deleteOne();
  ok(res, 200, "Listing deleted successfully.");
};
exports.sold = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return fail(res, 404, "Listing not found.");
  if (String(item.seller) !== String(req.user._id))
    return fail(res, 403, "You can only update your own listing.");
  item.status = "Sold";
  await item.save();
  ok(res, 200, "Listing marked as sold.", { item });
};
exports.myListings = async (req, res) => {
  const items = await Item.find({ seller: req.user._id }).sort({
    createdAt: -1,
  });
  ok(res, 200, "Your listings fetched.", { listings: items });
};
exports.adminDelete = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return fail(res, 404, "Listing not found.");
  await item.deleteOne();
  ok(res, 200, "Listing removed by admin.");
};

const Wishlist = require("../models/Wishlist");
const Item = require("../models/Item");
const { ok, fail } = require("../utils/response");
exports.add = async (req, res) => {
  const { productId } = req.params;
  if (!(await Item.exists({ _id: productId })))
    return fail(res, 404, "Listing not found.");
  if (await Wishlist.exists({ user: req.user._id, item: productId }))
    return fail(res, 409, "This listing is already in your wishlist.");
  const entry = await Wishlist.create({
    user: req.user._id,
    item: productId,
  });
  ok(res, 201, "Added to wishlist.", { wishlist: entry });
};
exports.list = async (req, res) => {
  const entries = await Wishlist.find({ user: req.user._id })
    .populate({
      path: "item",
      populate: { path: "seller", select: "name email department year" },
    })
    .sort({ createdAt: -1 });
  const items = entries.filter((e) => e.item).map((e) => e.item);
  ok(res, 200, "Wishlist fetched.", { items });
};
exports.remove = async (req, res) => {
  const { productId } = req.params;
  const entry = await Wishlist.findOneAndDelete({
    user: req.user._id,
    item: productId,
  });
  if (!entry) return fail(res, 404, "Listing not found in your wishlist.");
  ok(res, 200, "Removed from wishlist.");
};

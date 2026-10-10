const Report = require("../models/Report");
const Item = require("../models/Item");
const { ok, fail } = require("../utils/response");
exports.create = async (req, res) => {
  const { listing, reason, description } = req.body;
  if (!listing || !reason)
    return fail(res, 400, "Listing and reason are required.");
  if (!(await Item.exists({ _id: listing })))
    return fail(res, 404, "Listing not found.");
  if (await Report.exists({ listing, reporter: req.user._id }))
    return fail(res, 409, "You have already reported this listing.");
  const r = await Report.create({
    listing,
    reporter: req.user._id,
    reason,
    description,
  });
  ok(res, 201, "Report submitted successfully.", { report: r });
};
exports.all = async (req, res) => {
  const reports = await Report.find()
    .populate("listing", "title price status")
    .populate("reporter", "name email")
    .sort({ createdAt: -1 });
  ok(res, 200, "Reports fetched.", { reports });
};
exports.update = async (req, res) => {
  if (!["Pending", "Reviewed", "Resolved"].includes(req.body.status))
    return fail(res, 400, "Invalid report status.");
  const r = await Report.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  if (!r) return fail(res, 404, "Report not found.");
  ok(res, 200, "Report updated.", { report: r });
};
exports.users = async (req, res) => {
  const User = require("../models/User");
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  ok(res, 200, "Users fetched.", { users });
};

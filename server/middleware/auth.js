const jwt = require("jsonwebtoken");
const User = require("../models/User");
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res
        .status(401)
        .json({ success: false, message: "Please log in to continue." });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists." });
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
}
function adminOnly(req, res, next) {
  if (!req.user?.isAdmin)
    return res
      .status(403)
      .json({ success: false, message: "Admin access required." });
  next();
}
module.exports = { protect, adminOnly };

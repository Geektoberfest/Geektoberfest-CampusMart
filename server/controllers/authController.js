const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ok, fail } = require("../utils/response");
const token = (u) =>
  jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  department: u.department,
  year: u.year,
  profileImage: u.profileImage,
  isAdmin: u.isAdmin,
});
exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, department, year } = req.body;
  if (!name || !email || !password || !confirmPassword || !department || !year)
    return fail(res, 400, "All fields are required.");
  if (password !== confirmPassword)
    return fail(res, 400, "Passwords do not match.");
  if (password.length < 6)
    return fail(res, 400, "Password must be at least 6 characters.");
  const domain = process.env.ALLOWED_EMAIL_DOMAIN || "@rbunagpur.in";
  if (!email.toLowerCase().endsWith(domain))
    return fail(res, 400, `Please use your college email (${domain}).`);
  if (await User.findOne({ email: email.toLowerCase() }))
    return fail(res, 409, "Email is already registered.");
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({
    name,
    email: email.toLowerCase(),
    password: hash,
    department,
    year,
  });
  ok(res, 201, "Registration successful.", { user: publicUser(u) });
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return fail(res, 400, "Email and password are required.");
  const u = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!u || !(await bcrypt.compare(password, u.password)))
    return fail(res, 401, "Invalid email or password.");
  ok(res, 200, "Login successful.", { token: token(u), user: publicUser(u) });
};
exports.me = async (req, res) =>
  ok(res, 200, "User fetched.", { user: publicUser(req.user) });

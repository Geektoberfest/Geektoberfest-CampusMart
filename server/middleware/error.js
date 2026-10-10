function notFound(req, res) {
  res.status(404).json({ success: false, message: "Route not found" });
}
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 11000)
    return res
      .status(409)
      .json({
        success: false,
        message: "A record with these details already exists.",
      });
  if (err.name === "MulterError")
    return res.status(400).json({ success: false, message: err.message });
  const status = err.status || 500;
  res
    .status(status)
    .json({ success: false, message: err.message || "Something went wrong" });
}
module.exports = { notFound, errorHandler };

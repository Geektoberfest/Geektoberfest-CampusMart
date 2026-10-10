const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, "../uploads");
fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype))
      return cb(new Error("Only JPG, PNG and WebP images are allowed."));
    cb(null, true);
  },
  limits: { files: 5, fileSize: 5 * 1024 * 1024 },
});
module.exports = upload;

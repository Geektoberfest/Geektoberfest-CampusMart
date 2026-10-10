const router = require("express").Router();
const c = require("../controllers/reportController");
const { protect, adminOnly } = require("../middleware/auth");
router.post("/", protect, c.create);
router.get("/", protect, adminOnly, c.all);
router.patch("/:id", protect, adminOnly, c.update);
module.exports = router;

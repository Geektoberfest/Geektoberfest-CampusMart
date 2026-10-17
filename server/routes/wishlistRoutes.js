const router = require("express").Router();
const c = require("../controllers/wishlistController");
const { protect } = require("../middleware/auth");
router.get("/", protect, c.list);
router.post("/:productId", protect, c.add);
router.delete("/:productId", protect, c.remove);
module.exports = router;

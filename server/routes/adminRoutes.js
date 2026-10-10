const router = require("express").Router();
const c = require("../controllers/reportController");
const { protect, adminOnly } = require("../middleware/auth");
const Item = require("../models/Item");
router.use(protect, adminOnly);
router.get("/reports", c.all);
router.patch("/reports/:id", c.update);
router.get("/users", c.users);
router.get("/listings", async (req, res) => {
  const { ok } = require("../utils/response");
  const listings = await Item.find()
    .populate("seller", "name email")
    .sort({ createdAt: -1 });
  ok(res, 200, "Listings fetched.", { listings });
});
module.exports = router;

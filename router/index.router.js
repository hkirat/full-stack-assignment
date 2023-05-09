const router = require("express").Router();

// home route
router.get("/", (req, res) => {
  res.send("Hello Welcome to LEET CODE :)");
});

router.use("/user", require("./user/user.router"));
router.use("/admin", require("./admin/auth.router"));

module.exports = router;

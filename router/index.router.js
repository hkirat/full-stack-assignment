const router = require("express").Router();

// home route
router.get("/", (req, res) => {
  res.send("Hello Welcome to LEET CODE :)");
});

router.use("/user", require("./user/userAuth.router"));
router.use("/admin", require("./admin/authAdmin.router"));

module.exports = router;

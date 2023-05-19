const router = require("express").Router();
const fs = require("fs");

// home route
router.get("/", (req, res, next) => {
  res.send("Hello Welcome to LEET CODE :)");
  // throw new Error("Something went wrong");
  // next();
  // fs.readFile("/no-file-found", (err, data) => {
  //   if (err) next(err);
  //   else res.send(data);
  // });
});

router.use("/user", require("./user/user.router"));
router.use("/admin", require("./admin/auth.router"));

module.exports = router;

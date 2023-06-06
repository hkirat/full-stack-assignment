var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signout, signup, signin } = require("../controllers/auth");

// router.get("/signout", signout);
router.post(
  "/signup",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  signup
);

router.get(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  signin
);

module.exports = router;

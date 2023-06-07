var express = require("express");
var router = express.Router();
const { check } = require("express-validator");

const { signout, signup, signin } = require("../controllers/auth");


router.post("/signup", [
  check("password", "password is required").isLength({min: 3}), 
  check("email", "email is required").isEmail()
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

// router.get("/signout", signout);

module.exports = router;
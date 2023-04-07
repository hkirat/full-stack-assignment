const express = require("express");
const {
  emailValidation,
  passwordValidation,
} = require("../middlewares/validators");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", [emailValidation, passwordValidation], signup);

router.post("/login", [emailValidation, passwordValidation], login);

module.exports = router;

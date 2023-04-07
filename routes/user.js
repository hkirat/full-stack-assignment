const router = require("express").Router();

const { signup, login, logout } = require("../controllers/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;

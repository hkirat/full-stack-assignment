const router = require("express").Router();
const passport = require("passport");
const { signToken } = require("./../authServices/subscriberController");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/student/signup",
    session: false,
  }),
  async (req, res) => {
    const token = await signToken(req.body);
    res.status(200).json({
      status: "sucess",
      token: "Bearer " + token,
    });
  }
);

module.exports = router;

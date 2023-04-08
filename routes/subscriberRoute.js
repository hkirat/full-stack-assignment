const router = require("express").Router();
const {
  signupControl,
  loginControl,
  myQuestions,
  submitQuestion,
  validateSubmission,
  askQuestion,
  protect,
  convert,
} = require("./../authServices/subscriberController");

// studentRouter route distributing:
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/questions").post(protect, askQuestion).get(protect, myQuestions);
router
  .route("/submissions")
  .post(protect, validateSubmission)
  .patch(protect, submitQuestion);
router.route("/convert-question").post(protect, convert);

module.exports = router;

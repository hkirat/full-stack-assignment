const { displayQuestions } = require("./utils")
const app = require('express')
const router = app.Router();

router.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(displayQuestions());
})

module.exports = router;
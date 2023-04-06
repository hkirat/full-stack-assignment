const router = require('express').Router();
const { questions } = require('../controllers/quesController');

router.route('/questions').get(questions);

module.exports = router;

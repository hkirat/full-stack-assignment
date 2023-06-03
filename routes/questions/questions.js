const express = require('express');
const router = express.Router();

const QUESTIONS = [
    {
        title: 'Two states',
        description: 'Given an array , return the maximum of the array?',
        testCases: [
            {
                input: '[1,2,3,4,5]',
                output: '5',
            },
        ],
    },
];

router.get('/questions', function (req, res) {
    //return the user all the questions in the QUESTIONS array
    const { title, description, testCases } = req.query;
    const newQuestion = { title, description, testCases };
    QUESTIONS.push(newQuestion);
    res.sendStatus(200);
});

module.exports = router;

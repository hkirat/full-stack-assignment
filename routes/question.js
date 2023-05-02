const express = require('express');
const router = express.Router()

const QUESTIONS = [{
    question_id: 1, //adding this for ease of access
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]


router.get('/', (req, res) => {
    res.send("Question route")
})

router.get('/all', function (req, res) {

    //return the user all the questions in the QUESTIONS array

    res.status(200).json(QUESTIONS)
})

router.get("/submissions", function (req, res) {
    // return the users submissions for this problem
    const question_id = req.body.question_id;
    const user_id = req.body.user_id;

    let subs = [];
    SUBMISSION.forEach((sub) => {
        if (sub.question_id === question_id && sub.user_id === user_id) {
            subs.push(sub);
        }
    })

    res.status(200).json(subs);

});


router.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution

    //assuming the user is logged in, which means have token
    let this_question = {};
    let question_id = req.body.question_id;
    const response = {
        question_id: question_id,
        user_id: req.body.user_id, //will get from token, for now using from body
        answer: req.body.answer
    }

    QUESTIONS.forEach((que) => {
        if (que.question_id == question_id) {
            this_question = que;
        }
    })

    // Store the submission in the SUBMISSION array above
    SUBMISSION.push(response);
    console.log(SUBMISSION);

    if (response.answer === this_question.answer) {
        res.status(200).json({ "response": "Correct" });
    }
    else {
        res.status(200).json({ "response": "inCorrect" })
    }



});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

router.post("/question", (req, res) => {

})

module.exports = router

const express = require('express');
const router = express.Router()
const Question = require('../Models/Question')
const Submission = require('../Models/Submission')

const QUESTIONS = [{
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

router.get('/all', async function (req, res) {

    //return the user all the questions in the QUESTIONS array
    const questions = await Question.find({});
    res.status(200).json(questions)
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


router.post("/submissions", async function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    const question = req.body.question;
    const user = req.body.user;
    const language = req.body.language;
    const answer = req.body.answer;
    const isCorrect = req.body.isCorrect;

    //Add logic if the answer is correct

    const newSub = new Submission({
        question,
        user,
        language,
        answer,
        isCorrect
    })

    const sub = await newSub.save();

    res.json(sub);

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

router.post("/add", async(req, res) => {
    const title = req.body.title
    const description = req.body.description
    const difficulty = req.body.difficulty
    const acceptance = req.body.acceptance
    const examples = req.body.examples
    const testCases = req.body.testCases
    const adminid = req.body.adminid

    const newQue = new Question({
        title,
        description,
        difficulty,
        acceptance,
        examples,
        testCases,
        adminid
    })

    //checking if question already exisrs
    let queExists = await Question.exists({title: title});

    if(queExists) return res.status(500).json({"Error": "Already exists"})

    //TODO : checking if user is admin or not

    const savedQ = await newQue.save();
    res.json(savedQ);

})

module.exports = router

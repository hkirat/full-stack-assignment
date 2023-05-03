const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router()
const Question = require('../Models/Question')
const Submission = require('../Models/Submission')
const User = require('../Models/User')


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
    
    const {question, user, language, answer,isCorrect} = req.body;

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
    
    const {title, description, difficulty, acceptance, examples, testCases, adminid} = req.body

    // Checking if user is admin or not
    const userId = jwt.decode(adminid).id
    const user = await User.findById(userId);

    if(user.access != 'Admin'){
        return res.status(401).json({"Error": "Unauthorized"});
    }

    const newQue = new Question({
        title,
        description,
        difficulty,
        acceptance,
        examples,
        testCases,
        adminid: userId
    })

    //checking if question already exisrs
    let queExists = await Question.exists({title: title});

    if(queExists) return res.status(500).json({"Error": "Already exists"})

    

    const savedQ = await newQue.save();
    res.json(savedQ);

})

module.exports = router

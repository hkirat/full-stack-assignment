const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router()
const auth = require('../Middleware/auth');
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

//get question with id
router.get('/:title', async function(req, res){
    const title = req.params.title;

    const question = await Question.find({title: title})

    res.send(question);
})


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

router.post("/add", auth, async(req, res) => {
    
    const {title, description, difficulty, acceptance, examples, testCases} = req.body

    // Checking if user is admin or not
    const userId = req.userid
    console.log(userId)
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

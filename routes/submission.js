const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const Submission = require('../Models/Submission')

router.get('/', (req, res) => {
    res.send("Submission router");
})

//get all submission for logged in user
router.get("/all", auth, async function (req, res) {
    // return the users submissions for this problem

    const user_id = req.userid;

    let subs = [];
    subs = await Submission.find({user: user_id})

    res.status(200).json(subs);

});


//get all submissions for user for specific question
router.get("/all/question", auth, async function(req, res){
    const {question_id} = req.body;
    const user_id = req.userid;

    let subs = []
    subs = await Submission.find({user: user_id});
    subs.map((sub) => {
        if(sub.question == question_id){
            subs.push(sub);
        }
    })

    res.json(subs);

})

router.post("/add", auth, async function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    
    const {question, language, answer,isCorrect} = req.body;
    const user_id = req.userid

    //Add logic if the answer is correct

    const newSub = new Submission({
        question,
        user : user_id,
        language,
        answer,
        isCorrect
    })

    const sub = await newSub.save();

    res.json(sub);

});


module.exports = router;

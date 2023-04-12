const express = require('express')
const app = express()
const port = 3001

const USERS = []

//current User to check admin status
const currentUser = {}

const QUESTIONS = [{
    qID:0,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}]

const SUBMISSION = []  //adds all the accepted submmisions to the array

//Route allows signup to new users
app.post("/signup", function (req, res) {
  try {
    const {email, password, admin} = req.body

    // Logic to check if user already exists in USERS array
    const existingUser = USERS.find(user => user.email === email);
   
    if (existingUser) {
      res.status(409).send('User already exists') // Sending a conflict response
    } else {
      // Add user to the USERS array
      USERS.push({ email, password, admin })
      res.sendStatus(200); // Sending a success response with a 200 status code
    }

  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err })
  }
})
//Route allows login for both users and admin
app.post('/login', function(req, res) {
  try {
    const {email, password} = req.body
    // Logic to check if user exists in USERS array
    const user = USERS.find(user => user.email === email);
   
    if (user &&  user.password === password) {
      currentUser = user   //adds the current user to the variable
      res.status(200).send('Succesfully Logged In!') // Sending a success response
    } else {
      res.status(401).send('Please check your credentials!')  //Send status 401 if credentials are wrong 
    }

  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err })
  }
})
//Route allows to see all the questions
app.get('/questions', function(req, res) {
  try{
    res.status(200).json(QUESTIONS)   //return the user all the questions in the QUESTIONS 
  }catch(err){
    res.status(500).json({message: "Some error occured", err})
  }
})
//Route allows to check for other accepted submissions
app.get("/submissions", function(req, res) {
   // return the users submissions for this 
  try{
    const qID = req.query.qID
    const userSubmissions = SUBMISSION.filter(submission => submission.qID === qID);
    if(userSubmissions){
      res.status(200).json(userSubmissions)
    }
    else{
      res.status(409).send('Be the first to submit a solution!')
    }
  }catch(err){
    res.status(500).json({message: "Some error occured", err})
  }
});
// Route allows to submit an answer
app.post("/submission", function(req, res) {

   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  try {
    const {qID, submission} = req.body
    const isAccepted = Math.random()<0.5 //50% acceptance chance

    if(isAccepted){
      SUBMISSION.push({qID, submission})
      res.status(200).send('Submission Accepted')
    }
    else{
      res.status(200).send('Submission Rejected')
    }

  } catch (err) {
      res.status(500).json({ message: "Some error occurred", err })
    }

  });
// Route allows qadmins to add questions
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.route("/addQuestions", function(req, res){
// ensure that only admins can do that.
  try {
    const {qID, title, description, testCases} = req.body

    if(currentUser.admin === True){
        QUESTIONS.push({qID, title, description, testCases}) //add the question to the questions array
        res.status(200).send("Question succesfully added!")
    }
    else{
      res.status(401).send("Only admins can add questions!")
    }

  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err })
}
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
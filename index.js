const express = require('express')
const mongoose = require("mongoose");
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const app = express()
const port = 3001

app.use(express.json());

mongoose.connect("mongodb+srv://admin:admin@peetcode.exl3xcn.mongodb.net/")
.then(function(){
  app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
})
.catch(function(error){
  console.log(error)
})

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []


app.get('/', (req, res) => {
  res.send('Hello World!')
})


//signup and signin is in the users route
app.use("/users",userRouter);

//route for admin tasks
app.use("/admin",adminRouter);


//questions 
app.get('/questions', function(req, res) {
  return res.json(QUESTIONS)
});

//submissions
app.get("/submissions", (req, res) => {
  res.json(SUBMISSION);
});

app.post("/submissions", (req, res) => {
  // Assuming the user submission is sent in the request body
  const userSubmission = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Add the submission to the array with the acceptance status
  submissions.push({
    question: userSubmission.question,
    solution: userSubmission.solution,
    accepted: isAccepted,
  });

  res.send("Submission received!");
});

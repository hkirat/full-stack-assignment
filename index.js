const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    id: "1",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5",
      }, 
    ],
},
{
  id: "2",
  title: "SQUATS",
  description: "Somu went to the gym today. He decided to do X sets of squats. Each set consists of 15 squats. Determine the total number of squats that he did today.",
  testCases: [{
    input: "2",
    output: "30",
  },
  {
    input: "5",
    output: "75",
  },
  {
    input: "99",
    output: "1485",
  },
  {
    input: "1",
    output: "15",
  },
],

},
{
  id: "3",
  title: "Tour of King",
  description: "King loves to go on tours with his friends.King has N cars that can seat 5 people each and M cars that can seat 7 people each. Determine the maximum number of people that can travel together in these cars.",
  testCases: [{
    input: "{4,8}",
    output: "76",
  },
  {
    input: "{ 2, 13}",
    output: "101",
  },

],

},
{
  id: "4",
  title: "Ageing",
  description: "Chef's current age is 20 years, while Chefina's current age is 10 years. Determine Chefina's age when Chef will be X years old.",
  testCases: [{
    input: "25",
    output: "15",
  },
  {
    input: "36",
    output: "26",
  },
  {
    input: "54",
    output: "44",
  },

],
},


];


const SUBMISSION = [];

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let userExists = false;
  for(let user of USERS){
    if(user.email === email){
      userExists = true;
    }
    
    
  }
  if(!userExists){
    USERS.push({email, password});
  }

  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let userExists = false;
  for (let user of USERS) {
    if (user.email === email && user.password === password) {
      userExists = true;
    }
  }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (!!userExists) {
    res.status(200).send("WELCOME");
  } else {
    res.sendStatus(401);
  }


  
});

app.get('/questions', function(req, res) {


  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const { userId, questionId } = req.query;
   const submissions = [];
   for (let submission of SUBMISSION) {
     if (submission.userId === userId && submission.questionId === questionId) {
       submissions.push(submission);
     }
   }
 
   res.status(200).send(submissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { questionId, userId, code } = req.body;
   SUBMISSION.push({
     questionId: questionId,
     userId: userId,
     code: code,
     status: generateStatus(),
   });
   res.status(200);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
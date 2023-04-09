const express = require('express')
const app = express()
const port = 3000

const USERS = [];

const QUESTIONS = [{
    // problem id is added
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

];

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const{ email, password} = req.body;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const existingUser = USER.find(user => user.email === email)

  if(existingUser) {
    //if user with the given email is already there, then return 400 status code
    return  res.status(400).send("User already exist");
  }

  //if user is new means the email id and the password is not there in database then return 200 status code and print user created
  USERS.push({email,password});


  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const{ email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USER.find(user => user.email === email);

  if(!user){
    //if user does not exist then.......
    return res.status(401).send("Invalid user email-ID or  password");
  }

  // Also ensure that the password is the same
  // password----checking
  if(user.password !== password){
    // incorrect!
    return res.status(401).send("Invalid user email-ID or  password");
  }



  //if the email and password is correct, then a token is created and it is send back to the client
  const token = "random token";

  res.status(200).json({ token })
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
    //problemid is add
    const problemId = req.query.problemId;

    //find all the submission for the given problemId
    const problemSubmission = SUBMISSION.filter(submission => submission.problemId === problemId)

   // return the users submissions for this problem
  res.status(200).json(problemSubmission);
});


app.post("/submissions", function(req, res) {
    const { problemId, solution} = req.body;

    //Randomly accept or reject the soltuion
    const isAccepted = Math.random() < 0.5;


    //create a new submission object with problemId, soultion along with isAccepted
    const submission = {
      problemId,
      solution,
      isAccepted
    };

    //store the submission in the SUBMISSION array
    SUBMISSION.push(submission);


   //Return a response whether the solution is accepted or not

    const status = isAccepted ? "accepted" : "rejected";
  //successful status send
  res.status(200).json({ status })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MERA_KEY_HAI__TUMHE_KYU_BATAOO...';

const PROBLEMS = [];

let lastId = QUESTIONS.length;
app.post('/addproblems',function (req, res){
  const { title, description, testCases } = req.body;

  //check if the user is authenticated and authorised
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({ message: 'Unauthorized'});
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try{
    decodedToken = jwt.verify(token, SECRET_KEY);
  }catch (error) {
      return res.status(401).json({message : 'unauthorized'});
  }

  if(!decodedToken || decodedToken !== 'admin'){
    return res.status(401).json({message: 'unauthorized'});
  }

  //Generate the question id for new question
  const id = ++lastId;

  //create a new problem with an object
  const problem = {
    id,
    title,
    description,
    testCases
  }

  //store the proble in the array
  PROBLEMS.push(problem);

  //return a response indicating that the problem was added successfully
  res.status(200).json({
    message:'problem added successfull'
  });

});

// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});
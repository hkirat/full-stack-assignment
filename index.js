const express = require('express')
const app = express()
const port = 3002

const USERS = [];

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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).send('Email and Password both are required');
    }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const userExists = USERS.some(user => user.email === email);
    if(userExists){
        return res.status(409).send('User Already Exists');
    }

    const newUser = { email, password };
    USERS.push(newUser);

  // return back 200 status code to the client
    res.status(200).send('User Created Succesfully');
//   res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
    const user = USERS.find(user => user.email = email);
    if(!user){
        return res.status(401).send('Inavlid Credentials');
    }
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
    if(user.password === password){
        const token = 'RandomString';
        return res.status(200).send({ token });
    }
  
  // If the password is not the same, return back 401 status code to the client
    else{
        return res.status(401).send('Invalid Credentials');
    }

//   res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
//   res.send("Hello World from route 3!")
    res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
    const { email } = req.query;
    if(!email){
        return res.status(400).send('Email is required');
    }

    const userSub = SUBMISSION.filter(submission => submission.email === email);
    res.status(200).send(userSub);
//   res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { email, questionTitle, code } = req.body;

   if(!email || !questionTitle || !code){
        return res.status(400).send('Invalid');
   }

   const question = QUESTIONS.find(question => question.title === questionTitle);
   if(!question){
        return res.status(!404).send('Question not found');
   }

   const isCorrect = Math.round(Math.random()) == 1;
   const submission = { email, questionTitle, code, isCorrect };
   SUBMISSION.push(submission);

   res.status(200).send({ isCorrect });
//   res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addque", function(req, res){
    const { title, description, testCases } = req.body;

     const isAdmin = req.headers.authorization == 'ADMIN'; // checking if the user is an admin by using checking the tokens. Some random token here for now

    if(!isAdmin){
        return res.status(401).send("Unauthorized access!");
    }

    const newQuestion = { title, description, testCases };
    QUESTIONS.push(newQuestion);

    res.status(200).send('Question Added');

})



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

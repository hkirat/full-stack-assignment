const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('joi');
const port = 3001;

// use body-parser middleware to parse request body
app.use(bodyParser.json());

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

];

const signup_schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required()
});

const login_schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const question_schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  testCases:  Joi.array().items(
    Joi.object({
    input: Joi.string().required(),
    output: Joi.string().required()
  })
  ).required()
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  const { error, value } = signup_schema.validate(req.body);

  if (error)  {
    res.status(400).json({ error: error.details[0].message });
  } else  {

    const usernameTakenAlready = USERS.find(user => user.username == value.username);
    const emailPresentAlready = USERS.find(user => user.email == value.email);

    if (usernameTakenAlready) {

      const result = {
        error: `Username ${value.username} has been taken already. Please use a different username`
      };
      res.status(400).json(result);

    } else if (emailPresentAlready) {

      const result = {
        error: `There is an account registered with ${value.email}. Please signin or use forgot passowrd`
      };
      res.status(400).json(result);

    } else  {
      USERS.push(value);
      result = {
        message: `User ${value.username} has been signed up successfully.`
      };
      res.send(result);
    }
    
  }

});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  // return back 200 status code to the client
  const { error, value } = login_schema.validate(req.body);

  if (error)  {
    res.status(400).json({ error: error.details[0].message });
  } else  {

    const userIsPresent = USERS.find(user => user.username == value.username || user.email == value.username);
    if (userIsPresent)  {
      const passwordIsCorrect = USERS.find(user => (user.username == value.username || user.email == value.username) && user.password == value.password);

      if (passwordIsCorrect)  {

        const result = {
          message: `User ${value.username} has been successfully loggedin.`,
          sessionKey: "Should be a session key here."
        };
        res.json(result);
      } else  {

        const result = {
          error: "Incorrect password. Please try again."
        };
        res.status(401).json(result);
      }
    } else  {

      const result = {
        error: `Username ${value.username} does not exist. Please sign up.`
      };
      res.status(400).json(result);
    }
  }
  
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.post('/questions', function (req, res) { 
  const { error, value } = question_schema.validate(req.body);

  if (error)  {
    res.status(400).json({ error: error.details[0].message });
  } else  {
    
    const questionTitleUsedAlready = QUESTIONS.find(question => question.title == value.title);

    if (questionTitleUsedAlready) {

      const result = {
        error: `The title of the question ${value.title} has been used already. Please use a different title.`
      };
      res.status(400).json(result);
    } else  {
      QUESTIONS.push(value);
      const result = {
        message: "The question has been added successfully."
      };
      res.json(result);
    }
  }
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!");
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
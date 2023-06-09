const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 3001;

const app = express();
app.use(bodyParser.json());

// HELPER FUNCTIONS =========================================

function isValidCode(code) {
    // Work on this later
    
    return true;
}

function isValidLanguage(language) {
    if (LANGUAGES.find((lang) => lang === language)) {
        return true;
    }
    
    return false;
}

function questionExists(question_title) {
    if (QUESTIONS.find((question) => question.title === question_title) != undefined) {
        return true;
    }
    else {
        return false;
    }
}

function isValidDescription(description) {
    return true;
}

function isValidTestCases(testCases) {
    return true;
}

function isValidTitle(description) {
    return true;
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        res.status(401).json({ message: 'Please Include an Authentication Token'} )
    }
    
    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            res.status(400);
        }
        req.user = user;
        next();
    })
}

function isAdmin(email) {
  const user = USERS.find((user) => user.email === email);

  if (user.admin === 1) {
    return true;
  }
  else {
    return false;
  }
}
// ========================================================

/*
USER FORMAT
{
  email: "...",
  password: "...",
  admin: 0/1 // 0 means regular user, 1 means admin
}
*/

let USERS = [{
    email: "admin@admin.com",
    password: "password123",
    admin: 1,
}];

const LANGUAGES = ["C++17", "C++14", "Python3"];

let QUESTIONS = [{
    title: "Find Maximum",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

/*
SUBMISSIONS FORMAT
{
  email: "karan.handa.fox@gmail.com",
  question_title: "NAME OF QUESTION",
  language: "C++17",
  code: "CODE"
}
*/
let SUBMISSIONS = [];



app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  let password = req.body.password;
  let email = req.body.email;

  const user = USERS.find((user) => user.email === email);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (user) {
      // return back 401
    res.status(401).json({ message: 'Email already exists' });
  }

  const newUser = {
    email: email,
    password: password,
    admin: 0
  };
  USERS.push(newUser);
  
  // return back 200 status code to the client

  res.status(200).json({ message : 'Signup Successful!' });
})

app.post('/login', function(req, res) {
  // Add logic to decode bodyauthenticateToken
  // body should have email and password

  let password = req.body.password;
  let email = req.body.email;

  
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  
  // Also ensure that the password is the same
  if (!user || user.password != password) {
    // If the password is not the same, return back 401 status code to the client
    return res.status(401).json( { message : 'Incorrect email or password'} );
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = jwt.sign({ email: email }, 'secretKey');

  res.setHeader('Authorization', `Bearer ${token}`);

  res.status(200).json({ message: 'Login Successful!'});
})


app.get('/questions', authenticateToken, function(req, res) {

  res.status(200);
  res.send(QUESTIONS); 
 
  //return the user all the questions in the QUESTIONS array
})

app.get("/submissions", authenticateToken, function(req, res) {
  // somehow get current user's name

  // assert : user has been authenticated

  const email = req.user.email;
  const question_title = req.body.question_title;

  const userSubmissionsList = SUBMISSIONS.filter((submission) => 
    submission.question_title === question_title && submission.email === email
  );

  // return the users submissions for this problem
  res.status(200).send(userSubmissionsList);

});


app.post("/submissions", authenticateToken, function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
  
  const question_title = req.body.question_title;
  const email = req.user.email;
  const language = req.body.language;
  const code = req.body.code;

  if (!isValidCode(code) || !isValidLanguage(language) || !questionExists(question_title)) {
    return res.status(403).json({ message: 'Invalid Submission. Please make sure that code is non-empty, the language is valid, and the question exists'});
  }

  // assert : question_title, email, language and code are all valid

  SUBMISSIONS.push({
    email: email,
    question_title: question_title,
    language: language,
    code: code
  });
   
  res.status(200).json({ message: 'Submission Successful' })
  // Store the submission in the SUBMISSIONS array above
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/submitproblem", authenticateToken, (req, res) => {
  
  const email = req.user.email;

  if (!isAdmin(email)) {
    res.status(401).json({ message: 'You do not have admin priviledges' });
  }
      
  const title = req.body.title;
  const description = req.body.description;
  const testCases = req.body.testCases;

  if (!isValidTitle(title) || !isValidDescription(description) || !isValidTestCases(testCases)) {
    res.status(403).json({ message: 'Please make sure the problem is correctly formatted'} );
  }

  QUESTIONS.push({
      title: title,
      description: description,
      testCases: testCases
  });

  res.status(200).json({ message: 'Question successfully added' });
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
})
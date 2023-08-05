const express = require('express');
const app = express();
const port = 3001;
// Import the fetch.js module which has all fetch API calls
const fetchAPI = require('./fetch');

// initialize USERS, SUBMISSIONS, QUESTIONS
const USERS = [];
const SUBMISSION = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }, {
      input: "[10,20,3,4,5]",
      output: "20"
}]
}, {
    title: "Sorting",
    description: "Sort the array",
    testCases: [{
        input: "[10,20,3,4,5]",
        output: "[3,4,5,10,20]"
    }, {
      input: "[100,20,3,40,-5]",
      output: "[-5,3,20,40,100]"
}]
}
];


//JWT token
const jwt = require('jsonwebtoken');
app.use(express.json()); 

// Load the secret key from an environment variable
const secret_key = process.env.JWT_SECRET_KEY;

//middleware to check if the person was authenticated
//
function isAuthenticatedMiddleware(req, res, next) {
  const token = req.header('Authorization').substring('Bearer '.length);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please provide a valid token.' });
  }

  try {
    // Verify and decode the token using the secret key

    const decoded = jwt.verify(token, secret_key);

    // Extract the user's email from the decoded payload
    const userEmail = decoded.email;
    //console.log(userEmail);

    // Check if the user exists in the USERS array or database (you can use any data store here)
    const user = USERS.find(user => user.email === userEmail);
    //console.log(user);

    if (!user) {
      return res.status(401).json({ message: `Unauthorized. User ${userEmail} not found in USERS= ${USERS[0].email} ${USERS[0].password}. decoded= ${decoded.email} ${decoded.password} from token ${token} and secret_key ${secret_key}` });
    }

    // Store the user object in the request for future middleware or route handler
    req.user = user;

    console.log('If everything is valid, proceed to the next middleware or route handler');
    next();
  } catch (err) {
    return res.status(401).json({ message: `Unauthorized. Invalid token because of ${err}` });
  }
}

app.post('/signup', function(req, res) {

  // Add logic to decode body
  // body should have email and password
  const { email, password, isadmin } = req.body;
  //console.log(req.body);

  // Check if the user with the given email already exists in USERS array
  const existingUser = USERS.find(user => user.email === email);

  if (existingUser) {
    res.status(409).json({ message: 'User with this email already exists.' });
  } else {
    const newUser = { email, password, isadmin };
    USERS.push(newUser);

    res.status(200).json({ message: `User signed up successfully and all users are ${USERS}` });
  }
});

app.post('/login', function(req, res) {

  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const user = USERS.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed. Invalid email or password.' });
  }

  // Generate a JWT token with the user's ID as the payload
  console.log(`Secret key used for generating token ${secret_key}`);
  const token = jwt.sign({ email: user.email,  isadmin : user.isadmin}, secret_key, { expiresIn: '1h' });

  return res.status(200).json({ message: 'User logged in successfully.', token });
  
})

app.get('/questions', isAuthenticatedMiddleware, function(req, res) {

  //return the user all the questions in the QUESTIONS array
  questionslisthtml = "<html><head> Questions: </head><body>";
  let qnum = 0;
  for (let i = 0; i < QUESTIONS.length ; i++) {
    questionslisthtml = questionslisthtml + `<h>Title : ${QUESTIONS[i].title} </h><p>Description : ${QUESTIONS[i].description} </p>`;
    for (let j = 0; j < QUESTIONS[i].testCases.length; j++) {
      qnum = j + 1;
      questionslisthtml = questionslisthtml + `<p>TestCase ${qnum} : </p><p> Input : ${QUESTIONS[i].testCases[j].input} </p><p>Output : ${QUESTIONS[i].testCases[j].output} </p>`;
    }
  }
  questionslisthtml = questionslisthtml + "</body></html>";
  res.send(questionslisthtml);
})

app.get("/submissions", isAuthenticatedMiddleware, function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION);
});


app.post("/submissions", isAuthenticatedMiddleware, function(req, res) {

  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const submission = req.body;
  let isaccepted = Math.floor(Math.random() + 1);

  if (isaccepted) {
  SUBMISSION.push(submission);
  res.status(200).json({message : 'Solution is accepted.'});
  } else {
  res.status(401).json({message : 'Solution is rejected. Please re-submit'});
  }
 
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addquestions", isAuthenticatedMiddleware, function(req, res) {

   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const ques = req.body;
  let ques_to_push = {
    title: ques.title,
    description: ques.description,
    testCases: ques.testCases
};

  let isadmin = 0;
  for (let j = 0 ; j < USERS.length ; j++) {
    if (USERS[j].isadmin == 1 && ques.user == USERS[j].email) {
      isadmin = 1;
      break;
    }
  }
  if (isadmin) {
  QUESTIONS.push(ques_to_push);
  res.status(200).json({message : 'Question is accepted.'});
  console.log("Question is accepted");
  } else {
  res.status(401).json({message : 'Question is not accepted because you are not an admin'});
  }
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

/*
//make calls to Fetch API
// Example usage of fetch API calls
fetchAPI.signup(); // Call the signup API

async function loginUser_and_see_questions() {
const token = await fetchAPI.login();
if (token) {
console.log('Before adding question');
await fetchAPI.getQuestions(token);
await fetchAPI.addQuestion(token);
console.log("After adding questions");
await fetchAPI.getQuestions(token);
console.log('Before submitting solution');
await fetchAPI.getSubmissions(token);
console.log('Submitting solution')
await fetchAPI.submitSolution(token);
console.log('After submitting solution');
await fetchAPI.getSubmissions(token);
}
}

loginUser_and_see_questions();
*/


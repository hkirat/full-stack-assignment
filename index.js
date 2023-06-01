const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [];


const SUBMISSION = [];


// for parsing incoming JSON payloads
app.use(express.json());


/**
Request-body :
{"email":"one@example.com","password": "one","isAdmin":true}
*/
app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password, isAdmin } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const emailAlreadyExist = USERS.some((User) => { return User.email === email });

  if (!emailAlreadyExist) {
    const newUser = {
      email: email,
      password: password,
      userID: USERS.length + 1,
      isAdmin: isAdmin
    }
    USERS.push(newUser);
  } else {
    // send 'email already exists' message back to the client
    return res.status(200).json({ message: 'Email already exists' });
  }

  // return back 200 status code to the client
  return res.status(200).json({ message: 'Registration successful' });
})


function validatePassword(email, password) {
  const user = USERS.find((User) => { return User.email === email });
  if (user && user.password === password) {
    return { isvalid: true, user: user };
  } else {
    return { isvalid: false, user: user };
  }
}

/**
Request body :
{
 "email":"one@example.com",
 "password": "one"
}
 */
app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  let passwordValid = validatePassword(email, password).isvalid;

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (passwordValid) return res.status(200).json({ message: 'Logged in successfully' })
  else return res.status(401).json({ message: 'Email or Password Incorrect' })
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  return res.status(200).json(QUESTIONS);
})

// https://localhost:port/submissions/<questionID>
app.get("/submissions/:questionID", function (req, res) {
  // return the users submissions for this problem with the specified questionID
  const quesID = parseInt(req.params.questionID);
  const relatedSubmissions = SUBMISSION.filter((sub) => { return (sub.questionID === quesID) });

  return res.status(200).json({ relatedSubmissions });
});


/*
Dummy POST request body format
{ "questionID": 102,"userID": 21,"code": "..." }
*/
app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionID, userID, code } = req.body;
  const passed = Math.random() < 0.5;

  SUBMISSION.push(
    {
      questionID,
      userID,
      code,
      passed,
    }
  )
  if (passed) return res.status(200).json({ message: 'submission accepted' })
  else return res.status(200).json({ message: 'submission rejected' })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

/**
Request body format for /addProblem :

{ "email":"two@example.com",
  "password": "two",
  "problem":{
      "title": "String Reversal",   
      "description": "Given a string, reverse it.",   
      "questionID": 2,
      "testCases": [{       
            "input": "'hello'",       
            "output": "'olleh'"
          }]  
  }
}
*/
app.post('/addProblem', (req, res) => {
  const { email, password, problem } = req.body;
  const result = validatePassword(email, password);
  if (result.isvalid && result.user.isAdmin === true) {
    QUESTIONS.push(problem);
    return res.status(200).json({ message: "problem added" })
  } else {
    if (result.isvalid) return res.status(200).json({ message: "You need to be an admin" })
    else return res.status(200).json({ message: "Incorrect Password" })
  }


})



app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})
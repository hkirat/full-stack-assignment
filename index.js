const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const crypto = require('crypto');

app.use(cookieParser());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const USERS = [];

const QUESTIONS = [{
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    id: 2,
    title: "Is Prime",
    description: "Given a number, return if the given number is Prime or not?",
    testCases: [{
        input: "2",
        output: "YES"
      },
      {
        input: "1",
        output: "NO"
      }
    ]
  },
  {
    id: 3,
    title: "Is Odd",
    description: "Given a number, return YES if it is ODD else return NO",
    testCases: [{
        input: "2",
        output: "NO"
      },
      {
        input: "1",
        output: "YES"
      }
    ]
  }
];


const SUBMISSIONS = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  // console.log("USER: ", email);
  // console.log("PASS: ", password);

  const existingUser = USERS.find((user) => {
    return user.email === email && user.password === password;
  });

  if (!existingUser) {
    const userObject = {
      email: email,
      password: password,
      role: role
    };
    USERS.push(userObject);
    res.status(200).json({"status": "OKAY"});
  } else {
    res.json({"status": "User already exists"});
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
})

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const email = req.body.email;
  const password = req.body.password;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // console.log("USER: ", email);
  // console.log("PASS: ", password);
  const existingUser = USERS.find((user) => {
    return user.email === email && user.password === password;
  });

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if (existingUser) {
    res.statusCode = 200;
    res.send(generateRandomString(10));
  } else {
    res.statusCode = 401;
    res.send("Unauthorised!!!");
  }
})

app.get('/questions', function(req, res) {
  if (QUESTIONS.length == 0) {
    res.send("No questions yet");
  } else {
    res.json({"questions": QUESTIONS});
  }
  //return the user all the questions in the QUESTIONS array
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const questionId = req.body.questionId;
   const submissions = [];
 
   SUBMISSIONS.forEach((submission) => {
     if (submission.questionId === questionId) {
       submissions.push(submission);
      //  console.log("TRUE");
     }
    //  console.log("FALSE");
   });
 
  //  console.log("SUBMISSIONS: ", submissions);
 
   if (submissions.length == 0) {
     res.send("No Submissions for the question");
   } else {
     res.json({submissions: submissions});
   }
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const email = req.body.email;
  const questionId = req.body.questionId;
  const code = req.body.code;
  const submissionsLength = SUBMISSIONS.length;
  const submissionId = submissionsLength + 1;
  const randomBoolean = Math.random() >= 0.5;
  let status = "Accepted";
  if (!randomBoolean) {
    status = "Rejected";
  }

  const submissionObject = {
    id: submissionId,
    email: email,
    questionId: questionId,
    code: code,
    status: status
  };

  SUBMISSIONS.push(submissionObject);

  // console.log("SUBS: ", SUBMISSIONS);

  res.json({status: status});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/question", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const question = req.body.question;
  const newQuestionId = QUESTIONS.length + 1;

  question['id'] = newQuestionId;

  const isAdminUser = USERS.find((user) => {
    return user.email === email && user.password === password && user.role === 'admin';
  });

  if (!isAdminUser) {
    res.statusCode = 401;
    res.send("Unauthorised! Only Admin can add questions");
  } else {
    QUESTIONS.push(question);
    res.send("Question Added successfully!!!");
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
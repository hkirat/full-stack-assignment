const express = require('express')
const app = express()
const port = 3001

const user = [];


const QUESTIONS = [
  {
      title: "Two states",
      description: "Given an array , return the maximum of the array?",
      testCases: [
          {
              input: "[1,2,3,4,5]",
              output: "5",
          },
          {
              input: "[12,34,456,1000]",
              output: "1000",
          },
      ],
  },
  {
      title: "reduce to array sum",
      description: "Given an array , return the sum of the array?",
      testCases: [
          {
              input: "[1,2,3,4,5]",
              output: "15",
          },
          {
              input: "[12,34,456,1000]",
              output: "12",
          },
      ],
  },
  {
      title: "find min",
      description: "Given an array , return the min of the array?",
      testCases: [
          {
              input: "[1,2,3,4,5]",
              output: "1",
          },
          {
              input: "[10,40,20,30]",
              output: "100",
          },
      ],
  }
];

const SUBMISSIONS = [];

app.post('/signup', function(req, res) {
  // req.body represents the body of the HTTP POST request that is being sent to the server. The body typically contains data that the client wants to send to the server.
  const existuser = user.find((user) => user.email === email); // find method check from all array

  if (existuser) {
      return res.status(409).send("User already signuped");
  }
  else {
      user.push({ email, password });
      return res.status(200).send("User account created successfull");
  }
})

app.post('/login', function(req, res) {
  const { email, password } = req.body;
  const existuser = user.find(
      (user) => user.email === email && user.password === password
  ); // check email and password
  if (existuser) {
      const token = "randomtoken";
      res.status(200).json({ token, message: "login successfully" });
  } else {
      res.status(401).send("Invalid email or password please signup to new account !!");
  }
})

app.get('/questions', function(req, res) {

  const questiontitle = QUESTIONS.map(question => question.title);
  const questiondesc = QUESTIONS.map(question => question.description);
  const testcases = QUESTIONS.map(question => question.testCases);
  res.json({ questiontitle, questiondesc, testcases });
})

app.get("/submissions", function(req, res) {
  const { useroutput } = req.body; // assuming useroutput are included in the request body
    // this logic is correct but it doesn't work here we have to make changes in useroutput 
    let score = 0;
    for (let i = 0; i < QUESTIONS.length; i++) {
        for (let j = 0; j < QUESTIONS[i].testCases.length; j++) {
            if (QUESTIONS[i].testCases[j].output === useroutput) {
                score++;
            }
        }
    }
    res.json({ scrore: score })
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const { problemindex , useroutput, problemId } = req.body; // assuming problemindex and output are included in the request body
    // simulate a random acceptance/rejection of the submission
    const isAccepted = Math.random() < 0.5;

    const submission = {
        problemindex: problemId,
        useroutput: useroutput,
        isAccepted: isAccepted,
    };
    SUBMISSIONS.push(submission);
    res.status(200).json({
        message: isAccepted ? "Submission accepted!" : "Submission rejected.",
    });

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
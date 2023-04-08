const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3001
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const USERS = [
  {
    email: 'a@gmail.com',
    password: 'password_a'
  },
  {
    email: 'b@gmail.com',
    password: 'password_b'
  },
  {
    email: 'c@gmail.com',
    password: 'password_c'
  }
];

const QUESTIONS = [
  {
    ProblemID: "1",
    title: "Find maximum",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
    }]
  },
  {
    ProblemID: "2",
    title: "Find minimum.",
    description: "Given an array , return the minimum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "1"
    }]
  },
  {
    ProblemID: "3",
    title: "Activity Selection Problem",
    description: "You are given n activities with their start and finish times. Select the maximum number of activities that can be performed by a single person, assuming that a person can only work on a single activity at a time. ",
    testCases: [{
      input: "start[]  =  {10, 12, 20}, finish[] =  {20, 25, 30}",
      output: "0 2"
    }]
  },
  {
    ProblemID: "4",
    title: "Job Sequencing Problem ",
    description: "Given an array of jobs where every job has a deadline and associated profit if the job is finished before the deadline. It is also given that every job takes a single unit of time, so the minimum possible deadline for any job is 1. Maximize the total profit if only one job can be scheduled at a time.",
    testCases: [{
      input: "a-4-20, b-1-10, c-1-40 , d-1-30",
      output: "c, a"
    }]
  }
];


const SUBMISSIONS = [
  {
    problemId: 1,
    submissionId: 1,
    userId: 1,
    code: ' ',
    language: 'JavaScript',
    status: 'Accepted',
  },
  {
    problemId: 1,
    submissionId: 2,
    userId: 2,
    code: ' ',
    language: 'Python',
    status: 'Compilation Error',
  },
  {
    problemId: 2,
    submissionId: 3,
    userId: 3,
    code: ' ',
    language: 'Python',
    status: 'Wrong Answer',
  }
];

app.post('/signup', function (req, res) {
  // adding logic to decode body
  const { email, password } = req.body;
  // find user froms users array
  const userExist = USERS.find(user => user.email === email);
  // if user already exist then return 409 code 
  if (userExist) {
    return res.status(409).send("User already exists!");
  }
  // else push the user as registered user
  USERS.push({ email, password });
  res.status(200).send("User created successfully!");
})

app.post('/login', function (req, res) {
  // adding logic to decode body
  const { email, password } = req.body;
  // find user from user array
  const user = USERS.find(user => USERS.email === email);
  // if user doesn't exist then return 401 sattus code
  if (!user) {
    return res.status(401).send("incorrect email or password!");
  }
  // if wrong password id enterted then return 401 status code
  if (user.password != password) {
    return res.status(401).send("incorrect email or password!");
  }
  // if successful, then return any random token
  const token = "AnyToken";
  res.status(200).send({ token });
})

app.get('/questions', function (req, res) {
  // return all the questions
  res.send(QUESTIONS);
})

app.get("/submissions", function (req, res) {
  // find all the submmission for a problem and return them
  const ProbID = req.query.ProblemID;
  const subForProb = SUBMISSIONS.filter(prob => prob.problemId = probID);
  res.send(subForProb);
});


app.post("/submit", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problemId, userId, code, language } = req.body;
  const status = "";
  if (Math.random() < 0.5) status = "Accepted";
  else status = "wrong answer";
  const subID = Math.random() * 1000;
  const submission = {
    problemId,
    submissionId,
    userId,
    code,
    language,
    status,
  }
  SUBMISSIONS.push(submission);
  res.json({ subID, status });

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post('/createproblem', function (req, res) {
  // Check if the request is coming from an admin
  if (req.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { title, description, difficulty } = req.body;
  const problemId = QUESTIONS.length + 1;

  // Create a new problem object
  const problem = {
    problemId,
    title,
    description,
    testCases,
  };
  QUESTIONS.push(problem);
  res.json(problem);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})
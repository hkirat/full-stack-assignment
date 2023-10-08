const express = require('express')
const app = express()
const port = 3001

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.redirectWithStatus = function(statusCode, path) {
    this.status(statusCode);
    this.redirect(path);
  };
  next();
})

var USERS = {};

const QUESTIONS = [{
    title: "Max of array",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "Sorting",
    description: "Given an array , return the sorted array?",
    testCases: [{
        input: "[4,2,1,3,5]",
        output: "[1,2,3,4,5]"
    }]
  }
];

const SUBMISSIONS = [

]

app.post('/signup', function(req, res, next) {
  console.log(`Added new user----\n Username: ${req.body.email}, Password: ${req.body.password}`);
  USERS[req.body.email] = req.body.password
  next()
  }, function(req, res) {
  res.status(200).redirect('/?message=User+registration+complete.+Please+try+logging+in');
})

app.post('/login', function(req, res, next) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email
  const password = req.body.password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (email in USERS) {
    if (USERS[email] == password) {
      next()
    }
    else  {
      res.status(401).redirect('/?message=Please+Sign+Up')
    }
  }
  else {
    res.status(401).redirect('/?message=Please+Sign+Up')
  }
  }, function (req, res) {
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  console.log(`User log on----\n Username: ${req.body.email}`);
  const token = req.body.email;
  res.status(200).redirect(`/questions?token=${token}`)
})

app.get('/', (req, res) => {
  res.render('home', {message: req.query.message});
});

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  const token = req.query.token
  if (token) {
    res.render('questions', {QUESTIONS:QUESTIONS})
  }
  else {
    res.status(401).redirect('/?message=Please+Log+in+to+view+questions');
  }
})

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
  const token = req.query.token
  if (token) {
    const question_id = req.query.question_id
    res.render('submissions', {question:QUESTIONS[question_id], submissions:SUBMISSIONS.filter(sub => {return sub.question_id == question_id && sub.user == token})})
  }
  else {
    res.status(401).redirect('/?message=Please+Log+in+to+view+questions');
  }
});

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const isAccepted = Math.random() < 0.5;
   const question_id = Number(req.body.question_id);
   const user = req.body.user;
   // Store the submission in the SUBMISSION array above
   SUBMISSIONS.push({
    user: user,
    question_id: question_id,
    isAccepted: isAccepted
});
res.send(SUBMISSIONS.filter(sub => {return sub.question_id == question_id && sub.user == user}))
});

app.listen(port, function() {
  console.log(`Leetcode clone app listening on port ${port}`)
})

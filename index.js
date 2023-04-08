
const express = require('express')
const app = express()
const port = 3005
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS = [];
var loggedUser = '';
const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "5"
        }]
    },
    {
        title: "sort an array",
        description: "Given an array , return a sorted array",
        testCases: [{
            input: "[4,2,1,3,5]",
            output: "[1,2,3,4,5]"
        }]
    }
];


const SUBMISSION = [
]

app.post('/signup', function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const email = req.body.email;
    const password = req.body.password;
    const rights = req.body.rights;
    for (let i = 0; i < USERS.length; i++) {
        if (email == USERS[i].email) {
            res.send("user already exist");
            return;
        }
    }

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push({ email: email, password: password,rights : rights})

    // return back 200 status code to the client
    res.status(201).send("user added successfully")
    loggedUser = email;

    // return back 200 status code to the client
    //res.send('Hello World!')
})

app.post('/login', function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const email = req.body.email;
    const password = req.body.password;

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    for (let i = 0; i < USERS.length; i++) {
        if (email == USERS[i].email) {
            if (password == USERS[i].password) {
                // If the password is the same, return back 200 status code to the client
                // Also send back a token (any random string will do for now)
                loggedUser = email;
                res.status(200).send("logged in successfully");
            }
            else {
                // If the password is not the same, return back 401 status code to the client
                // Also send back a token (any random string will do for now)
                res.status(401).send("logged in failed");
            }
            return;
        }
        res.status(401).send("user does not exit sign up");
    }

})

app.get('/questions', function (req, res) {

    res.json(QUESTIONS);
})

app.get("/submissions/:id", function (req, res) {
    // return the users submissions for this problem
    const question_id = req.params.id;
    for (let i = 0; i < USERS.length; i++) {
        if (SUBMISSION[i].email == loggedUser && SUBMISSION[i].question_id == question_id && loggedUser != "") {
            res.send(SUBMISSION[i].code);
        }
    }
});


app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution

    const email = req.body.email;
    const question_id = req.body.question_id;
    const code = req.body.code;
    const status = Math.random() < 0.5 ? 'accepted' : 'rejected';

    // Store the submission in the SUBMISSION array 
    if (loggedUser != '') {
        SUBMISSION.push({ email: email, question_id: question_id, code: code, status: status });
        res.send("submission is " + status);
    }
    else {
        res.send("login first");
    }
});

app.get("/logged", function (req, res) {
    res.send('currently logged user is ' + loggedUser);
});

app.post("/addquestion", function(req, res) {
    for (let i = 0; i < USERS.length; i++) {
      if (USERS[i].email == loggedUser && USERS[i].rights == "admin") {
        let title = req.body.title;
        let description = req.body.description;
        let testCases = req.body.testCases;
        QUESTIONS.push({
          title: title,
          description: description,
          testCases: testCases
        });
        res.status(200).send("Question added successfully");
        return;
      } 
    }
    res.status(401).send("You don't have valid rights");
  });
  

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})

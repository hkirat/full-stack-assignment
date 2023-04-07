const express = require('express')
const app = express()
const port = 3001;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json);
const USERS = [];

const QUESTIONS = [{
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5",
    }]
}];


let SUBMISSION = [];

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    let user = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user", // default role
    };
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const sameEmail = USERS.some((user) => user.email === req.body.email);
    if(!sameEmail) {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = req.body.password;
        if (req.body.role) {
            user.role = req.body.role;
        }
        USERS.concat(user);
    } else {
        req.json("Email already exists");
    }

    res.json(USERS);

  // return back 200 status code to the client
  // res.send('Hello World!')
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    let details = {
        email: "",
        password: "",
    };

    details.email = req.body.email;
    details.password = req.body.password;

    USERS.some((user) => {
        if(user.email === details.email) {
            if(user.password === details.password) {
                if(user.role === "user") {
                    res.json({ accessToken: "userToken"});
                } else{
                    res.json("adminToken");
                }
            } else {
                res.json("invalid password");
            }
        } else {
            res.json("user does not exist");
        }
    });
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


 // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

    res.json(QUESTIONS);
  //return the user all the questions in the QUESTIONS array
  //res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
    res.json(SUBMISSION);
  //res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {

    const { id, solution } = req.body;

    let x = Date.now();
    let status = false;
    if (x % 2 == 0) {
        status = true;
    }
    SUBMISSION = SUBMISSION.concat({ id, solution });

    res.json({ isAccepted: status, SUBMISSION });
    // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  // res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

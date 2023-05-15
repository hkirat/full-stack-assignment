const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [
            {
                input: "[1,2,3,4,5]",
                output: "5",
            },
        ],
    },
];

const SUBMISSION = [];
const PROBLEMS=[];
app.get("/", (req, res) => {
    res.send("hello I'm running ");
});
app.post("/signup", function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const existingUser = USERS.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).send("User with this email already exists");
    }

    // Store email and password in the USERS array
    USERS.push({ email, password });

    // Return 200 status code to the client
    console.log(USERS);
    res.sendStatus(200);
});

app.post("/login", function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).send("Email and Password required");
    }

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    const userExists = USERS.find((user) => user.email === email);
    // If the password is the same, return back 200 status code to the client
    if(!userExists || !userExists.password===password){
            return res.status(401).send("401 Login failed incorrect password");
    }
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    const token = 'random_token';

    // Return 200 status code and the token to the client
    res.status(200).json({ token });
  
});

app.get("/questions", function (req, res) {
    //return the user all the questions in the QUESTIONS array
    res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
    // Retrieve and return the user's submissions for this problem
  // Assuming there is a user identifier in the request query parameter called "userId"

//   const userId = req.query.userId;

  // Filter the submissions array to get only the submissions for the specified user

//   const userSubmissions = SUBMISSIONS.filter(submission => submission.userId === userId);

    // return the users submissions for this problem
    res.send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const submissions= req.body;
    const isSubmitted = Math.random()>0.5?true:false;
    if(isSubmitted){
        SUBMISSION.push({submissions, isSubmitted});
        return res.status(200).send('Submission successful');
    }else{
        return res.status(200).send('Submission Rejected');
    }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
function isAdmin(req, res, next) {
    // Check if the user is an admin (implement this based on your authentication system)
    const isAdmin = req.body.user.isAdmin; // Assuming isAdmin property exists in the user object

    if (isAdmin) {
        // User is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // User is not an admin, return a 401 Unauthorized status
        res.status(401).send("Unauthorized");
    }
}
app.post('/problems',isAdmin, function(req, res) {
    // Check if user is an admin
    // const isAdmin = req.headers.authorization === 'Bearer ADMIN_TOKEN'; // Replace 'ADMIN_TOKEN' with your admin authentication token
  
    // If user is not an admin, return 401 Unauthorized
    // if (!isAdmin) {
    //   return res.status(401).send('Unauthorized');
    // }
  
    // Add new problem logic
    const {problem} = req.body; // Assuming the problem data is included in the request body
  
    // Add the problem to the PROBLEMS array or perform necessary database operations
    PROBLEMS.push(problem);
  
    // Return a response indicating success
    res.status(200).send('Problem added successfully');
  });
  
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

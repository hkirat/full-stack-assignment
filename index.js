const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON body data
app.use(express.json());

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSION = [];
/*SHAPE OF THE OBJECT SHOULD BE ABYTHING
{
    userId: "1",
    questionId: "1",
    code: "function max(arr){return Math.max(..arr)}",
    status: "accepted"
},
{
    userId: "1",
    questionId: "1",
    code: "function max(arr){return Math.max(..arr)}",
    status: "rejected"
},*/


// Helper function to find user by token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    // Find the user associated with the token
    const user = USERS.find((u) => u.token === token);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    // Attach the user to the request object
    req.user = user;
    next();
}


/*  1>create route that lets an admin add a new question
    2>ensure that only admin can add it up(make condition in signup and authenticate admin and users)
*/
// Middleware to authenticate admin users
const authenticateAdmin = (req, res, next) => {

    const { user } = req;

    // Check if the user is an admin
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Only admins can perform this action" });
    }

    // If the user is authenticated as admin, proceed to the next middleware/route
    next();
};

//signup route
app.post('/signup', (req, res) => {
    /*post because user will send the data & when signup is used then this(/signup) route will be hit in backend
    res.send('Hello World!')
  
    1> add logic to decode body
    2> body should have email and password
    3> store email and password(as is for now) in the USERS array above (only if the user with the given email doesnt exists)
    4> return back the 200 status code to the client */

    // Step 1: Parse the email and password from the request body
    const { email, password, role } = req.body;

    // Step 2: Check if the user already exists in the USERS array
    const userExists = USERS.find((user) => user.email === email);

    // Step 3: If user already exists, send a 400 status code with an error message
    if (userExists) {
        return res.status(400).send('User already exists!');
    }

    // Add new user with role (admin or user)
    // Step 4: If user doesn't exist, add the new user to the USERS array
    const newUser = {
        id: USERS.length + 1, // or use any UUID generator
        email,
        password,
        role: role || 'user'
    };

    USERS.push(newUser);

    res.status(200).json({ message: "User registered successfully" });
    // Step 5: Respond with a 200 status code to indicate successful signup
});



app.post('/login', (req, res) => {
    /*post because user will send the data & when signup is used then thi(/login) route will be hit in backend
  res.send("Hello world from login")
  1> add logic to decode body
     body should have email and password

  2> check if the user with the given email exists in the USERS array
      Also ensure that the password is the same

  3> If the password is the same ,return back 200 status code to the client
     Also send back a token(any random string will do for a now)
     If the password is not the same then return back the 401 status code would be  return to the client
     */

    // Step 1: Parse the email and password from the request body
    const { email, password } = req.body;

    // Step 2: Check if the user with the given email exists in the USERS array
    const user = USERS.find((user) => user.email === email);

    // Step 3: If the user doesn't exist, send back a 401 status code (Unauthorized)
    if (!user) {
        return res.status(401).send('User not found');
    }

    // Step 4: If the user exists, check if the password matches
    if (user.password !== password) {
        return res.status(401).send('Incorrect password');
    }

    // Step 5: If the password matches, return a 200 status code and a token (for now, a simple random string)
    const token = Math.random().toString(36).substr(2); // Generate a simple random token
    user.token = token; // Save token to user
    res.status(200).json({ message: 'Login successful', token });
});


// Route for admin to add a new question
app.post('/admin/questions', authenticateAdmin, authenticateAdmin, (req, res) => {
    const { title, description, testCases } = req.body;


    // Validate the question input
    if (!title || !description || !Array.isArray(testCases)) {
        return res.status(400).json({ message: "Invalid question format" });
    }

    // Add the new question to the QUESTIONS array
    QUESTIONS.push({ id: QUESTIONS.length + 1, title, description, testCases });

    res.status(201).json({ message: "Question added successfully", question: { title, description, testCases } });
});


app.get('/questions', (req, res) => {
    /*get because developer will send the questions from backend and need to shown up
    //res.send("Hwllo world from questions")
     1> return the user all the questions in the QUESTIONS 
    */

    // Step 2: Send back the QUESTIONS array as the response
    res.status(200).json(QUESTIONS);

})


app.get('/submissions', (req, res) => {
    /*get because backend will send the all submission from db  and need to shown up on the page
    //return the users submissions for this problem
    //res.send("Hello from submission")*/

    // Step 2: Send back the SUBMISSION array as the response
    res.status(200).json(SUBMISSION);
});



app.post('/submission', authenticateToken, (req, res) => {
    /*post because submission also need to send to backend for checkup the code whether it is right or not
    res.send("Correct!")
    1>let the user submit a problem, randomly accept or reject the solution
    2>Store the submission in the SUBMISSION array above*/

    // Step 1: Extract userId, questionId, and code from the request body
    const { questionId, code } = req.body;
    const question = QUESTIONS.find(q => q.id === parseInt(questionId));

    if (!question) {
        return res.status(400).json({ message: "Invalid questionId" });
    }
    // Step 2: Randomly accept or reject the submission
    const status = Math.random() > 0.5 ? 'accepted' : 'rejected';  // 50% chance

    // Step 3: Create a new submission object
    const newSubmission = {
        userId: req.user.id, // Using the authenticated user's id
        questionId,
        code,
        status
    };

    // Step 4: Store the new submission in the SUBMISSION array
    SUBMISSION.push(newSubmission);

    // Step 5: Send back a response indicating whether the solution was accepted or rejected
    res.status(200).json({ message: `Submission ${status}!`, submission: newSubmission });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


//use in memory objrct to bring that data or save it for a now because there is no db
const express = require('express')
const app = express()
const port = 3001

//get data from json files
const USERS = require('./users.json');
const QUESTIONS = require('./questions.json');
const SUBMISSION = require('./submission.json');

const fs = require('fs');

app.post('/signup', function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const {
        username,
        email,
        password,
        name
    } = req.body;
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    // Check if email already exists in the JSON data
    const userExists = USERS.some((user) => user.email === email);
    if (userExists) {
        return res.status(400)
            .send('Email already exists');
    }
    const newData = {
        id,
        name,
        age,
        gender,
        comment,
        rating,
        pass
    };

    // Save the updated data array to the data file
    data.push(newData);
    // return back 200 status code to the client
    fs.writeFile('./data.json', JSON.stringify(data), err => {
        if (err) {
            console.error(err);
            res.status(500)
                .send('Error writing to data file');
        } else {
            res.status(200)
                .send('Data saved successfully');
        }
    });

})

app.post('/login', function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const {
        email,
        password
    } = req.body;
    // Check if the user with the given email exists in the USERS array
    const user = USERS.find((user) => user.email === email);
    if (!user) {
        return res.status(401)
            .send('Email not found');
    }

    // Also ensure that the password is the same
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client

    if (user.password !== password) {
        return res.status(401)
            .send('Incorrect password');
    }

    res.status(200)
        .send(`Welcome, ${user.name}`)



    res.send('Hello World from route 2!')
})

app.get('/questions', function (req, res) {

    //return the user all the questions in the QUESTIONS array
    res.send(QUESTIONS)
})

app.get("/submissions", function (req, res) {
    // return the users submissions for this problem
     // Get the problem id from the query parameters
  const problemId = req.query.problemId;

  // Filter the submission data to get only the submissions for the given problem id
  const submissions = SUBMISSION.filter((submission) => submission.problemId === problemId);

  // Return the filtered submissions
  res.status(200).send(submissions);
   
});


app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    res.send(SUBMISSION)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/problems", function (req, res) {
    // Get data from request body
    const {
        title,
        description,
        testCases
    } = req.body;

    // Check if user is admin (you will need to implement some sort of authentication for this)
    const isAdmin = true; // placeholder for demo purposes, should be replaced with real authentication logic

    // If user is not an admin, send 403 forbidden status code
    if (!isAdmin) {
        return res.status(403)
            .send("Only admins can add new problems");
    }

   

    // Create new problem object
    const newProblem = {
        
        title: title,
        description: description,
        testCases: testCases
    };

    // Add new problem to the QUESTIONS array
    QUESTIONS.push(newProblem);

    // Save the updated QUESTIONS array to the questions.json file
    fs.writeFile("./questions.json", JSON.stringify(QUESTIONS), err => {
        if (err) {
            console.error(err);
            res.status(500)
                .send("Error writing to questions file");
        } else {
            res.status(200)
                .send("Problem added successfully");
        }
    });
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})

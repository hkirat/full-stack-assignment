const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const port = 3001

app.use(bodyParser.urlencoded({ extended: true }));
const USERS = [
  {
    email: "username",
    password: "test123"
  }
];


const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = [

]


app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //--it will take enter from the html form--
  const email = req.body.email;
  const password = req.body.password;
  const userDetails = { email, password };
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.forEach(user => {
    if (user.email === email) {
      console.log("Email is already exist Please try with another email id");
      //user will be send to the signup again
      // res.redirect("/signup");
    }
    else {
      USERS.push(userDetails);
      //user will be redirect to the login page 
      res.send(USERS);
    }

  })
  res.redirect("/login");
  // return back 200 status code to the client
});

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // --take the input from the html form
  const email = req.body.email;
  const password = req.body.password;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  USERS.forEach(user => {
    if (user.email === email && user.password === password) {
      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const token = "hkfsarr2134"
      res.status(200).send({ message: "Login Succesfully", token: token });
    }
    else {
      // If the password is not the same, return back 401 status code to the client
      res.status(401).send({ message: "wrong credentials" });
    }
  });


});

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  //using foreach
  QUESTIONS.forEach(ques => {
    res.write(`<h1>${ques.title}</h1>`);
    res.write(`<h2>${ques.description}</h2>`);

    ques.testCases.forEach(testcase => {
      res.write(`<p style="font-size: 1.5rem">${testcase.input}</p>`);
      res.write(`<p style="font-size: 1.5rem">${testcase.output}</p>`);

    })
    res.send();
  })


})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)

})
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded()); // To parse URL-encoded bodies

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
  // Send the HTML file when the user is on the root path
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Added Two Users 
const USERS = [
  {
    name: "admin",
    password: "password",
  },
  {
    name: "user",
    password: "password",
  }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  title: "Find duplicates",
  description: "Given an array , return the duplicates in the array?",
  testCases: [
    {
      input: "[1,1,2,3,4,5]",
      output: "[1]"
    }
  ]
}
];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {

  let name = req.body.name;
  let password = req.body.password;

  const userExists = USERS.find(user => user.name === name);
  if (userExists) {
    return res.status(400).send('User already exists');
  } else {
    USERS.push({ name, password });
    res.send(
    
    `<html>
    <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        color: #212529;
      }
      h1 {
        text-align: center;
        padding: 20px;
        background-color: #343a40;
        color: #ffffff;
      }
      h2, p {
        text-align: center;
      }
      a {
        display: block;
        text-align: center;
        margin-top: 20px;
        text-decoration: none;
        color: #007bff;
      }
    </style>
    <body>
    <h1>Signup Successful</h1>
    <h2>Welcome ${name} to the community!</h2>
    <p>Login with the same username and password.</p>
    <a href="/">Login</a>
    </body>
    </html>
      `)
    console.log(USERS)
}
})

app.post('/login', function(req, res) {

  let name = req.body.name;
  let password = req.body.password;
  const user = USERS.find(user => user.name === name && user.password === password);

if (!user) {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).send(
     `<html>
     <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #212529;
          }
          h1 {
            text-align: center;
            padding: 20px;
            background-color: #dc3545;
            color: #ffffff;
          }
          p {
            text-align: center;
          }
          a {
            display: block;
            text-align: center;
            margin-top: 20px;
            text-decoration: none;
            color: #007bff;
          }
        </style>
      </head>
      <body>
      <h1>Unauthorized</h1>
      <p>Invalid username or password.</p>
      <a href="/">Signup First</a>
      </body>
      </html>
      `);    
    };
  
  const token = Math.random().toString(36).substring(2);
  console.log('Access token:', token)
  res.send(`<html>
  <style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f8f9fa;
    color: #212529;
  }
  h1 {
    text-align: center;
    padding: 20px;
    background-color: #007bff;
    color: #ffffff;
  }
  a {
    display: block;
    text-align: center;
    margin-top: 20px;
    text-decoration: none;
    color: #007bff;
  }
  form {
    margin-top: 20px;
    text-align: center;
  }
  input {
    margin-bottom: 10px;
    padding: 5px;
  }
  button {
    background-color: #28a745;
    color: #ffffff;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
</style>
</head>
  <body>
  <h1>Welcome to LEETCODE  ${name} </h1>
  <a href="/questions"> Try Out Some Questions</a>
  </body>
  <div>
    ${name === 'admin' ? 
    `<form method='post' action='/questions'>
    <h2>Add a new problem statement:</h2>
    <div><input name='title' placeholder='Title of the question:'/></div>
    <div><input name='description' placeholder='Describe the question:' /></div>
    <div><input name='testcase' placeholder='Enter the testcases:'/></div>
    <div><input name='output' placeholder='Enter the expected output:' /></div>
    <h3>
    <button type='submit'>Add this question to the list.</button>
    </h3>
    </form>`:'<div />'}
  </div>
</html>`)
})

app.get('/questions', function(req, res) {

  const questions = `<html>
  <head>
  <title>Questions List</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      color: #212529;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #007bff;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 20px;
      background-color: #ffffff;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #343a40;
    }
    p {
      color: #6c757d;
    }
    strong {
      color: #28a745;
    }
    button {
      background-color: #007bff;
      color: #ffffff;
      padding: 10px;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
  <body>
  <h1>Questions List</h1>
  <h2>Choose a question to solve:</h2>
  <a href="/"><button>Logout</button></a>
  <ul>
  ${QUESTIONS.map(question => `
  <li>
  <h2>${question.title}</h2>
  <p>${question.description}</p>
  <h3>Test Cases:</h3>
  <ul>
    ${question.testCases.map(testCase => `
      <li>
        <strong>Input:</strong> ${testCase.input}<br>
        <strong>Output:</strong> ${testCase.output}
      </li>
    `).join('')}
  </ul>
  <a href="/submissions">
  <button>Submit your answer</button>
  </a>
</li>
`).join('')}
</ul>
  </body>
  </html>
  `
  //return the user all the questions in the QUESTIONS array
  res.send(questions);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.send(`<html>
   <body>
    <form method="post" action="/submissions" style="text-align: center; margin: 20px;">
      <textarea name="answer" style="width: 100%; height: 200px; padding: 10px; margin-top: 10px; margin-bottom: 20px; font-size: 16px;">Type your answer here</textarea>
      <button type="submit" style="padding: 10px; background-color: green; color: white; border: none; border-radius: 5px; cursor: pointer;">Submit</button>
    </form>
  </body>
  </html>`)

});


app.post("/submissions", function(req, res) {
  const acceptedStatement = "Your answer is accepted";

  SUBMISSION.push(req.body)
  console.log(SUBMISSION)
  
  res.send(`
    <html>
    <head>
      <title>Submission Result</title>
      <style>
        body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
          align-items: center;
          text-align: center;
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          margin: 0;
          padding: 0;
        }

        h1 {
          color: #4CAF50;
        }

        h2 {
          color: #333;
        }

        a {
          
          margin-top: 50px;
          padding: 10px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }

      </style>
    </head>
    <body>
      <h1>Submission Successful</h1>
      <h2>${acceptedStatement}</h2>
      <a href="/questions">Try More Questions Here</a>
    </body>
  </html>`)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/questions', (req, res) => {
  res.send(`
  <html>
    <head>
      <title>Question Posted</title>
      <link rel="stylesheet" type="text/css" href="styles.css">
    </head>
    <body>
      <h1>Question Posted</h1>
      <p>This question is posted. <a href="/questions">Checkout the updated Problems list.</a></p>
    </body>
  </html>
`)
  console.log(req.body.title)
  QUESTIONS.push(
    {
      title: req.body.title,
      description: req.body.description,
      testCases: [{
        input: req.body.testcase,
        output: req.body.output
      }]
    }
  )

})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
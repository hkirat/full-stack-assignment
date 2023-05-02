const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8002;
//
const morgan = require('morgan');
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//ARRAYS
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "user@gmail.com",
    password: "test1234",
    role: "user",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "admin@gmail.com",
    password: "test1234",
    role: "admin",
  },

];
const SUBMISSIONS = [
  {
    id: 1,
    userId: 1,
    questionId: 1,
    code: 'console.log("hello world")',
    language: "javascript",
    createdAt: new Date("2022-01-01"),
  },
  {
    id: 2,
    userId: 1,
    questionId: 2,
    code: "print('hello world')",
    language: "python",
    createdAt: new Date("2022-01-02"),
  },
];


app.post('/signup', function (req, res) {
  const { username, email, password } = req.body;
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send('Username already taken');
  }
  users.push({ username, email, password });
  res.send(`Received signup request from username:${username} email:${email} password:${password}`);
});


app.post('/login', function (req, res) {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.send(`Welcome ${user.username}!`);
  } else {
    res.send("Invalid credentials or User does not Exist");
  }
  
});

app.get('/signup', function (req, res) {
  res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sign Up Page</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-image: url('https://kinsta.com/wp-content/uploads/2020/04/code-review-tools-1024x512.png');
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
                background-color: #f5f5f5;
               
              }
              h1 {
                text-align: center;
                margin-top: 50px;
                color: white;
              }
              form {
                max-width: 400px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
              }
              label {
                display: block;
                font-weight: bold;
                margin-bottom: 10px;
              }
              input[type="text"],
              input[type="email"],
              
              
              input[type="password"] {
                width: 100%;
                padding: 10px;
                margin-bottom: 20px;
                border: none;
                border-radius: 5px;
                box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
              }
              select {
                width: 100%;
                padding: 10px;
                margin-bottom: 20px;
                border: none;
                border-radius: 5px;
                box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
              }
              input[type="submit"] {
                background-color: #4caf50;
                color: #fff;
                border: none;
                border-radius: 5px;
                padding: 10px 20px;
                cursor: pointer;
              }
              input[type="submit"]:hover {
                background-color: #3e8e41;
              }
            </style>
          </head>
          <body>
            <h1>Sign Up</h1>
            <form action="/signup" method="POST">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" placeholder="Enter your Name" required>
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" placeholder="Enter your Email" required>
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" placeholder="Enter your Password" required>
              <label for="role">Role:</label>
              <select id="role" name="role" required>
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <input type="submit" value="Sign Up">
            </form>
          </body>
        </html>
        `);
});


app.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
  <html>
    <head>
      <title>Login Page</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-family: Arial, sans-serif;
                background-image: url('https://media.licdn.com/dms/image/C560DAQEgHPHqD5imEA/learning-public-crop_675_1200/0/1624996877423?e=2147483647&v=beta&t=81OldrrArevFz1xKt_WDQJyPpPr-iR6YldTeCNktdGQ');
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
                background-color: #f5f5f5;
        }
        form {
          width: 400px;
          margin: 50px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0px 0px 10px #ccc;
        }
        label {
          display: block;
          margin-bottom: 10px;
        }
        input[type="email"],
        input[type="password"] {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          box-sizing: border-box;
          margin-bottom: 20px;
          font-size: 16px;
        }
        input[type="submit"] {
          background-color: #4CAF50;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        input[type="submit"]:hover {
          background-color: #45a049;
        }
        h1 {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>Login</h1>
      <form action="/login" method="POST">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="user@gmail.com">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" value="test1234">
        <input type="submit" value="Login">
      </form>
    </body>
  </html>
    `);
});

const QUESTIONS = [
  {
    questionid: 777,
    title: "Palindrome",
    description: "Given a string, check if it's a palindrome",
    testcases: [{
      input: "racecar",
      output: "true"
    }]
  }
];

app.get('/questions', function (req, res) {
  res.status(200).send(QUESTIONS);
});

const isAuthorized = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Not Found");
  }
  const user = users.find(user => user.email === email);
  if (user) {
    if (user.password === password) {
      if (user.role === "Admin") {
        next();
      } else {
        res.status(400).json({ message: "You are not Authorized" });
      }
    } else {
      res.status(400).json({ message: "Incorrect Password" });
    }
  }
};

app.post("/questions", isAuthorized, function (req, res) {
  const question = {
    title: req.body.title,
    description: req.body.description,
    testcases: req.body.testcases
  };
  question.questionid = QUESTIONS.length + 1;
  QUESTIONS.push(question);
  res.status(200).send("Question added successfully");
});

app.post('/submission', function (req, res) {
  const { qId, code } = req.body;
  const random = Math.random() < 0.5;
  
  if (random) {
    const submissionId = SUBMISSIONS.length + 1;
    const submission = { id: submissionId, qId, code, createdAt: new Date() };
    SUBMISSIONS.push(submission);

    res.send(`Received a submission for qid: ${qId}`);
  } else {
    res.status(400).send("Submission Denied");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express');
const morgan = require('morgan');
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

const USERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'user@gmail.com',
    password: 'test1234',
    role: 'user',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'admin@gmail.com',
    password: 'test1234',
    role: 'admin',
  },
];

const QUESTIONS = [
  {
    title: 'Question 1',
    description: 'This is the first question',
    testcases: [],
    id: 1,
  },
  {
    title: 'Question 2',
    description: 'This is the second question',
    testcases: [],
    id: 2,
  },
  {
    title: 'Question 3',
    description: 'This is the third question',
    testcases: [],
    id: 3,
  },
];
const SUBMISSIONS = [
  {
    id: 1,
    userId: 1,
    questionId: 1,
    code: 'console.log("hello world")',
    language: 'javascript',
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 2,
    userId: 1,
    questionId: 2,
    code: "print('hello world')",
    language: 'python',
    createdAt: new Date('2022-01-02'),
  },
];

app.post('/signup', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('email and password are required');
  }
  const userExists = USERS.some((user) => user.email === email);
  if (!userExists) {
    {
      req.body.id = USERS.length + 1;
      USERS.push(req.body);
      const user = req.body;
      const { password: _, ...userDemo } = user;
      res.status(200).json({
        message: 'signup successful',
        user: userDemo,
      });
    }
  } else {
    res.status(400).json({
      message: 'user already exists',
    });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('email and password are required');
  }
  const user = USERS.find((user) => user.email === email);
  if (user) {
    if (user.password === password) {
      const { password: _, ...userDemo } = user;
      res.status(200).json({
        message: 'login successful',
        user: userDemo,
      });
    } else {
      res.status(401).json({
        message: 'incorrect password',
      });
    }
  } else {
    res.status(401).json({
      message: 'user does not exist',
    });
  }
});

app.get('/questions', (req, res) => {
  res.status(200).json(QUESTIONS);
});

const isAuthorized = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('email and password are required');
  }
  const user = USERS.find((user) => user.email === email);
  if (user) {
    if (user.password === password) {
      if (user.role === 'admin') {
        next();
      } else {
        return res.status(401).json({
          message: 'you are not authorized',
        });
      }
    } else {
      return res.status(401).json({
        message: 'incorrect password',
      });
    }
  }
};

app.post('/questions', isAuthorized, (req, res) => {
  const question = req.body;
  question.id = QUESTIONS.length + 1;
  QUESTIONS.push(question);
  res.status(200).json({
    message: 'question added successfully',
    question,
  });
});

app.get('/submissions/:qid', (req, res) => {
  const { qid } = req.params;
  const submission = SUBMISSIONS.filter(
    (submission) => submission.questionId === Number(qid)
  );
  res.status(200).json(submission);
});

app.post('/submissions', (req, res) => {
  const random = Math.random() < 0.5;
  if (random) {
    const submission = req.body;
    submission.id = SUBMISSIONS.length + 1;
    submission.createdAt = new Date();
    SUBMISSIONS.push(submission);
    res.status(200).json({
      message: 'submission successful',
      submission,
    });
  } else {
    res.status(400).json({
      message: 'submission failed',
    });
  }
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
  <html>
    <head>
      <title>Login Page</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
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

app.get('/signup', (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sign Up Page</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
            }
            h1 {
              text-align: center;
              margin-top: 50px;
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
            <input type="text" id="name" name="name" placeholder="Enter your name" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>
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

///run the server
const port = 3000;
app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [
  {
    id: '1',
    title: 'Maximum Number',
    description: 'Given an array of integers, find the maximum number.',
    testCases: [
      {
        input: '[4, 7, 2, 9, 1, 5]',
        output: '9',
      },
      {
        input: '[-2, -5, -3, -1, -4]',
        output: '-1',
      },
      {
        input: '[10, 20, 30, 40, 50]',
        output: '50',
      },
    ],
  },
  {
    id: '2',
    title: 'Palindrome',
    description: 'Given a string, check if it is a palindrome.',
    testCases: [
      {
        input: 'racecar',
        output: 'true',
      },
      {
        input: 'hello',
        output: 'false',
      },
      {
        input: 'A man a plan a canal Panama',
        output: 'true',
      },
    ],
  },
  {
    id: '3',
    title: 'FizzBuzz',
    description:
      "Given a number, print out 'Fizz' if the number is divisible by 3, 'Buzz' if it is divisible by 5, and 'FizzBuzz' if it is divisible by both 3 and 5.",
    testCases: [
      {
        input: '3',
        output: "'Fizz'",
      },
      {
        input: '5',
        output: "'Buzz'",
      },
      {
        input: '15',
        output: "'FizzBuzz'",
      },
      {
        input: '7',
        output: '7',
      },
    ],
  },
];

const SUBMISSION = [];

app.post('/signup', (req, res) => {
  try {
    // Add logic to decode body
    const { email } = req.body;
    const { password } = req.body;
    const { isAdmin } = req.body;

    // body should have email and password
    if (!email) {
      throw new Error('Please provide the email');
    }
    if (!password) {
      throw new Error('Please provide the password');
    }

    if (isAdmin === undefined) {
      throw new Error('Please provide the isAdmin attribute');
    }

    let userExists = false;
    // Store email and password (as is for now) in the USERS array above
    for (let i = 0; i < USERS.length; i += 1) {
      if (USERS[i].email === email) {
        userExists = true;
        break;
      }
    }
    // return back 200 status code to the client

    if (!userExists) {
      const userId = USERS.length + 1;
      const userObj = {
        email,
        password,
        userId,
        isAdmin,
      };

      USERS.push(userObj);
      res.status(200).send('Account Created Successfully');
    } else {
      res.status(409).send('User with given email address already exists');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/login', (req, res) => {
  try {
    // Add logic to decode body
    const { email } = req.body;
    const { password } = req.body;
    // body should have email and password
    if (!email) {
      throw new Error('Please provide the email');
    }
    if (!password) {
      throw new Error('Please provide the password');
    }
    let userExists = false;
    let userpassword;
    // Check if the user with the given email exists in the USERS array
    for (let i = 0; i < USERS.length; i += 1) {
      if (USERS[i].email === email) {
        userExists = true;
        userpassword = USERS[i].password;
        break;
      }
    }
    // Also ensure that the password is the same
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    if (userExists) {
      if (userpassword === password) {
        res.status(200).send(randomstring.generate(50));
      } else {
        res.status(401).send('Incorrect Password');
      }
    } else {
      res.status(401).send("User with this email doesn't exist");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/questions', (req, res) => {
  // return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});

app.get('/submissions', (req, res) => {
  try {
    // Get the email from the query parameter
    const { email } = req.query;
    if (!email) {
      throw new Error('Please provide the email');
    }

    // return the user's submissions for this problem
    const submissionReturn = [];
    for (let i = 0; i < SUBMISSION.length; i += 1) {
      if (SUBMISSION[i].email === email) {
        submissionReturn.push(SUBMISSION[i]);
      }
    }
    res.status(200).send(submissionReturn);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/submissions', (req, res) => {
  try {
    // Add logic to decode body
    const { email } = req.body;
    const { questionId } = req.body;
    const { code } = req.body;

    if (!email) {
      throw new Error('Please provide the email');
    }
    if (!questionId) {
      throw new Error('Please provide the questionId');
    }
    if (!code) {
      throw new Error('Please provide the code');
    }

    // let the user submit a problem, randomly accept or reject the solution
    const acceptedValues = ['accepted', 'rejected'];
    const status = acceptedValues[Math.floor(Math.random() * acceptedValues.length)];

    const subObj = {
      email,
      questionId,
      code,
      status,
    };

    // Store the submission in the SUBMISSION array above
    SUBMISSION.push(subObj);

    res.status(200).send('Code submitted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/questions', (req, res) => {
  try {
    const { email } = req.body;
    const { question } = req.body;

    if (!email) {
      throw new Error('Please provide the email');
    }
    if (!question) {
      throw new Error('Please provide the question');
    }

    // Check if user is an admin
    let isAdmin = false;
    let userExists = false;
    for (let i = 0; i < USERS.length; i += 1) {
      if (USERS[i].email === email) {
        userExists = true;
        isAdmin = USERS[i].isAdmin;
        break;
      }
    }

    if (userExists) {
      if (isAdmin) {
        QUESTIONS.push(question);
        res.status(200).send('Question added');
      } else {
        res.status(403).send('Access denied for non admins');
      }
    } else {
      res.status(401).send("User with this email doesn't exist");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(port, () => {
});

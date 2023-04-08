const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const uuid = require("uuid").v4;
const ejs = require("ejs");

const app = express();
const port = 3001;

const USERS = [];
const SUBMISSIONS = [
  {
    id: 1,
    userId: 1,
    questionId: 1,
    code: "code",
    status: "accepted",
  },
];

const QUESTIONS = [
  {
    id: uuid(),
    title: "Two sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    testCases: [
      {
        nums: [1, 2, 3, 4, 5],
        target: 9,
      },
    ],
  },
];

// session middleware
app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the landing page
app.get("/", function (req, res) {
  const { user } = req.session;
  if (user && user?.isAdmin) {
    return res.send(`
      <h1>Welcome, ${user.email}!</h1>
      <p>You are an Admin</p>
      <p><a href="/logout">Logout</a></p>
      <p>You can view the <a href="/questions">questions</a> or <a href="/submissions">submissions</a> page</p>
    `);
  } else if (user) {
    return res.send(`
      <h1>Welcome, ${user.email}!</h1>      
      <p><a href="/logout">Logout</a></p>
      <p>You can view the <a href="/questions">questions</a> or <a href="/submissions">submissions</a> page</p>
    `);
  }
  return res.send(`
    <h1>Deepak Rajkumar's App</h1>
    <p>Please <a href="/login">login</a> or <a href="/signup">signup</a></p>
    <p>You can view the <a href="/questions">questions</a> or <a href="/submissions">submissions</a> page</p>
  `);
});

// // Serve the logout page
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }

    res.send(
      `<script>alert('Successfully logged out!'); window.location.href='/';</script>`
    );
  });
});

// Serve the login page
app.get("/login", function (req, res) {
  res.send(`
      <h1>Login</h1>
      <form method="post" action="/login">
        <div>
          <label>Email:</label>
          <input type="email" name="email" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? Please <a href="/signup">signup!</a></p>
      <p>Go back to <a href="/">home</a> page</p>
    `);
});

// Handle login
app.post("/login", function (req, res) {
  // Get the email and password from the request body
  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    // If the user does not exist or the password is incorrect, send back a 401 status code
    res.sendStatus(401);
  } else {
    // If the user exists and the password is correct, send back a 200 status code
    // Also send back a token (any random string will do for now)
    const token = uuid();
    user.token = token;
    req.session.user = user;

    // Hidden the status code return
    // return res.status(200).json({ message: "User authenticated" });
    // To view in UI, added a redirect
    res.send(
      `<script>alert('Successfully logged in!'); window.location.href='/';</script>`
    );
  }
});

// Serve the signup page
app.get("/signup", function (req, res) {
  res.send(`
      <h1>Signup</h1>
      <form method="post" action="/signup">
        <div>
          <label>Email:</label>
          <input type="email" name="email" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required>
        </div>
        <button type="submit">Signup</button>
      </form>
      <div>Note: To signup as an admin, use 'admin.com' domain</div>
      <p>Already have an account? Please <a href="/login">login!</a></p>
      <p>Go back to <a href="/">home</a> page</p>
    `);
});

// Handle signup
app.post("/signup", function (req, res) {
  // Get the email and password from the request body
  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email already exists in the USERS array
  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    // If the user already exists, send back a 409 status code
    return res.status(409).json({ error: "User already exists" });
  } else {
    // If the user does not exist, create a new user and add it to the USERS array
    const newUser = {
      id: uuid(),
      email,
      password,
      isAdmin: email.includes("admin.com"),
    };
    USERS.push(newUser);
    req.session.user = newUser;

    // Send back a 201 status code --> if created successfully.
    // return res.status(200).json({ message: "User created successfully" });
    // To view in UI, added a redirect
    res.send(
      `<script>alert('Successfully signed up and logged in to the application!'); window.location.href='/';</script>`
    );
  }
});

// Serve questions
app.get("/questions", function (req, res) {
  const { user } = req.session;
  if (!user) {
    return res.send(
      `<script>alert('No active sessions. Please login again!'); window.location.href='/login';</script>`
    );
  }
  let questionsHTML = "";
  QUESTIONS.forEach((question) => {
    questionsHTML += `<li>${question.title} - ${question.description}</li>`;
  });

  let addQuestionHTML = "";
  if (user.isAdmin) {
    addQuestionHTML = `<h2>Add Question</h2>
                        <form action="/questions" method="POST">
                          <label for="title">Title:</label>
                          <input type="text" id="title" name="title" required><br><br>
                          <label for="description">Description:</label>
                          <textarea id="description" name="description" rows="4" cols="50" required></textarea><br><br>
                          <button type="submit">Add Question</button>
                        </form>`;
  } else {
    addQuestionHTML = `("To add a question, log in as an admin")`;
  }

  const html = `
    <h1>Deepak Rajkumar's App</h1>
    <p><a href="/">Home</a></p>
    <h2>Questions</h2>
    <ul>${questionsHTML}</ul>    
    ${addQuestionHTML}
  `;
  res.send(html);
});

// handle questions POST
app.post("/questions", function (req, res) {
  const { user } = req.session;
  if (!user) {
    return res.send(
      `<script>alert('No active sessions. Please login again!'); window.location.href='/login';</script>`
    );
  }
  if (!user.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }
  const newQuestion = { id: uuid(), title, description };
  QUESTIONS.push(newQuestion);

  return res.send(
    `<script>alert('New Question Added!'); window.location.href='/questions';</script>`
  );
});

// serve submissions
app.get("/submissions", function (req, res) {
  const { user } = req.session;
  if (!user) {
    return res.send(
      `<script>alert('No active sessions. Please login again!'); window.location.href='/login';</script>`
    );
  }
  const userSubmissions = SUBMISSIONS.filter(
    (submission) => submission.userId === user.id
  );
  ejs.renderFile(
    "submissions.ejs",
    { submissions: userSubmissions },
    function (err, data) {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send("An error occurred while rendering the submissions page");
      } else {
        res.send(data);
      }
    }
  );
});

// handle submissions POST
app.post("/submissions", function (req, res) {
  const { user } = req.session;
  const { questionId, code } = req.body;

  if (!questionId || !code) {
    return res.status(400).json({ error: "questionId, and code are required" });
  }

  const submission = {
    id: uuid(),
    userId: user.id,
    questionId,
    code,
    status: "pending",
  };

  // randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;
  submission.status = isAccepted ? "accepted" : "rejected";

  SUBMISSIONS.push(submission);

  return res.status(200).json({ message: "Submission received", submission });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;

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



//configure environment variables into the process
dotenv.config({ path: "./config.env" });

//body parser
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from the server");
});

app.post("/signup", (req, res) => {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(400).send("Email and password are required to signup");
  }

  let usersString = fs.readFileSync(
    "./local-data/users.json",
    "utf-8",
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  const USERS = JSON.parse(usersString);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = USERS.find((usr) => usr.email === email);
  if (user) {
    res
      .status(400)
      .send(
        "User With that email already exists. If this is you please try sign-in "
      );
    return;
  }

  USERS.push({ email, password });

  usersString = JSON.stringify(USERS);

  if (!user) {
    fs.writeFile("./local-data/users.json", usersString, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  }

  // return back 200 status code to the client
  res.status(200).send("Signed up Successfully 🎉");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(400).send("Email and password are required to login");
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let usersString = fs.readFileSync(
    "./local-data/users.json",
    "utf-8",
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  const USERS = JSON.parse(usersString);

  const user = USERS.find((usr) => {
    return usr.email == email;
  });

  if (!user) {
    res
      .status(400)
      .send(
        "There is no Account associated with that email, please sign-up instead !"
      );
  }
  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    res.status(401).send("Email or password incorrect !");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  console.log(process.env.JWT_EXPIRES_IN);

  const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    message: "success",
    token,
    data: {
      user,
    },
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  
  res.status(200).json({
    message:"success",
     data: QUESTIONS 
  });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  let submissionString = fs.readFileSync(
    "./local-data/submissions.json",
    "utf-8",
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  const SUBMISSIONS = JSON.parse(submissionString);
  res.status(200).send(SUBMISSIONS);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
    
  let submissionString = fs.readFileSync(
    "./local-data/submissions.json",
    "utf-8",
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  const SUBMISSIONS = JSON.parse(submissionString);

   let testpass=Math.floor( Math.random()*2);
   if(!testpass){
    res.status(200).send('solution rejected');
    return;
   }
    let {email}=req.body;

  if (testpass) {
    SUBMISSIONS.push({ email });

    submissionString = JSON.stringify(SUBMISSIONS);

    // Store the submission in the SUBMISSION array 
    fs.writeFile("./local-data/submission.json", submissionString, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
  res.status(200).send("submission Accepted");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

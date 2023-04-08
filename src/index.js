// requiring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");

const app = express();

// requiring my mongoDB-Atlas 
require("./db/conn");
const UserCollection = require("./db/users");

const { json } = require("express");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// app.use()
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.set()
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


// app.get() for /index (home) page
app.get("/", function (req, res) {
  // for Code, refer to path- /templates/views/index.hbs
  res.render("index");
});

// app.get() for /signup page
app.get("/signup", function (req, res) {
  // for Code, refer to path- /templates/views/signup.hbs
  res.render("signup");
});

// app.get() for /login page
app.get("/login", function (req, res) {
  // for Code, refer to path- /templates/views/login.hbs
  res.render("login");
});


// app.post() for /signup page
app.post("/signup", async function (req, res) {
  try {
    const userPassword = req.body.password;
    const userConfirmPassword = req.body.confirmPassword;

    if (userPassword === userConfirmPassword) {
      const registerUser = new UserCollection({
        dbName: req.body.name,
        dbEmail: req.body.email,
        dbPassword: userPassword,
        dbConfirmPassword: userConfirmPassword,
      });

      const registered = await registerUser.save();
      res.status(201).render("login");
    } else {
      res.send("<h1>Passwords are not matching</h1>");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});


// app.post() for /login page
app.post("/login", async function (req, res) {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const findEmail = await UserCollection.findOne({ dbEmail: userEmail });

    if (findEmail.dbPassword === userPassword) {
      res.status(201).render("questions");
    } else {
      res.send("<h1>Invalid Login Details</h1>");
    }
  } catch (error) {
    res.status(400).send("<h1>Invalid Details</h1>");
  }
});


// app.get() for /questions page 
app.get('/questions', function(req, res) {
  // return the user all the questions 
  // for Code, refer to path- /templates/views/questions.hbs
  res.render("questions");
})


// app.get() for /submission page 
app.get("/submission", function(req, res) {
  // return the users submissions for this problem
  // for Code, refer to path- /templates/views/submission.hbs
  res.render("submission");
});

// app.post() for /submission page 
app.post("/submission", async function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution :-
  try {
    randomNum = Math.round(Math.random() * 5 );
    if (randomNum === 1 || randomNum === 3 || randomNum === 5) {
      res.render("accepted");
    } else if (randomNum === 0 || randomNum === 2 || randomNum === 4) {
      res.render("rejected");
    }
  } catch (error) {
    res.status(400).render("rejected");
  }
});


// for /accepted route
app.post("/accepted", function(req, res) {
  // for Code, refer to path- /templates/views/accepted.hbs 
  res.render("accepted");
});


// for /rejected route
app.post("/rejected", function(req, res) {
  // for Code, refer to path- /templates/views/rejected.hbs
  res.render("rejected");
});


// app.listen() for this Backend-Server 
app.listen(port, function (req, res) {
  console.log(`Server running on port: ${port}`);
});
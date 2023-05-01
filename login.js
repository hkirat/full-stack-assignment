const app = require('express')
const router = app.Router();
const ejs = require('ejs');
const session = require('express-session');


const { doesUserExist, displayUserObj } = require('./utils');

router.use(session({
    secret: 'my-secret-key',     //This is a middleware function for setting up sessions in an Express application. The session middleware creates a new session middleware function with the provided options. The secret option is a string that is used to sign the session ID cookie. The resave option forces the session to be saved back to the session store, even if the session was never modified during the request. The saveUninitialized option forces a session to be saved to the session store, even if the session is new and has not been modified.                                    
    resave: false,
    saveUninitialized: true,
  }));                                  

router.get('/login', function (req, res) {
    res.send(`
    <html>
      <head>
        <title>Login</title>
      </head>
      <body>
        <form method="post" action="/login">
          <label for="email">Enter Email:</label>
          <input type="email" id="email" name="email"><br>
          <label for="password">Enter Password:</label>
          <input type="text" id="password" name="password"><br>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);

})

router.post('/login', function (req, res) {
    let user = {
        password: req.body.password,
        email: req.body.email
    }
    if (doesUserExist(user)) {
        req.session.user = user; // Store the user information in the session
        res.status(200).send(`
        <html>
        <head>
          <title>Authentication successful</title>
        </head>
        <body>
          <h1> Welcome ${user.email}!</h1>
        </body>
      </html>
        `)
    } else {
        res.status(401).send(`
        <html>
        <head>
          <title>Login Unsuccessful</title>
        </head>
        <body>
          <h1>Either email or password is incorrect!</h1>
        </body>
      </html>
        `)
    }

})
module.exports = router
const express = require('express');
const app = express();
const router = express.Router();

const setupSignupRoutes = (router) => {
  router.post('/signup', function(req, res) {
    // Add logic to decode body
    // body should have email and password

    const email = req.body.email;
    const password = req.body.password;
  
  
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
    const userExits = USERS.some(user => user.email === email);

    if(userExits) {
      res.sendStatus(409);
    } else {

      USERS.push({email,password})
    }
  
    // return back 200 status code to the client
    res.sendStatus(200);
  })
}


  app.listen(3001, function() {
    console.log(`Example app listening on port ${3001}`);
  })

  app.use(router);

  module.exports = setupSignupRoutes;
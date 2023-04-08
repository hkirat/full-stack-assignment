const express = require('express');
require('dotenv').config();
const helper = require('./helper.js');
const app = express();


app.post('/signup', function(req, res) {
  //signUp method will responsible for signup implementation
  const resp = helper.signUp(req);
  if(!resp.error){
    // return back 200 status code to the client
    res.status(200).json(resp);
  }else if(resp.error){
    // return back 401 status code to the client if email already exists
    res.status(401).json(resp);
  }else if(resp === null){
    res.status(407).json({
      error: true,
      message: 'User registration unsuccessful,try after some time.'
    });
  }
})

app.post('/login', function(req, res) {
  //login method will responsible for login implementation
  const resp = helper.login(req);
  if(!resp.error){
    // return back 200 status code to the client
    res.status(200).json(resp);
  }else if(resp.error){
    // return back 401 status code to the client if email and password does not match
    res.status(401).json(resp);
  }else if(resp === null){
    res.status(407).json({
      error: true,
      message: 'User login unsuccessful,try after some time.'
    });
  }
})

app.get('/questions', function(req, res) {
  //getQuestions method will responsible for get questions implementation
  const resp = helper.getQuestions();
  if(!resp.error){
    // return back 200 status code to the client
    res.status(200).json(resp);
  }else if(resp.error){
    // return back 401 status code to the client if Questions empty
    res.status(401).json(resp);
  }else if(resp === null){
    res.status(407).json({
      error: true,
      message: 'Loading questions unsuccessful,try after some time.'
    });
  }
})

app.get("/submissions", function(req, res) {
  //getSubmissions method will responsible for get submission for the problem implementation
  const resp = helper.getSubmissions();
  if(!resp.error){
    // return back 200 status code to the client
    res.status(200).json(resp);
  }else if(resp.error){
    // return back 401 status code to the client if email already exists
    res.status(401).json(resp);
  }else if(resp === null){
    res.status(407).json({
      error: true,
      message: 'Loading submissions unsuccessful,try after some time.'
    });
  }
});


app.post("/submissions", function(req, res) {
  //postSubmission method will responsible for post submission for the problem implementation
  const resp = helper.postSubmission(req);
  if(!resp.error){
    // return back 200 status code to the client
    res.status(200).json(resp);
  }else if(resp.error){
    // return back 401 status code to the client if submissions empty
    res.status(401).json(resp);
  }else if(resp === null){
    res.status(407).json({
      error: true,
      message: 'Posting submissions unsuccessful,try after some time.'
    });
  }
});

// leaving as hard todos
const isAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === 'admin') {
    next();
  } else {
    res.status(401).json({
      error: true,
      messgae: 'Only Admins can Add the problem.'
    });
  }
};

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problems', isAdmin, (req, res)=> {
  //postSubmission method will responsible for post the problem implementation
  const resp = helper.adminAddProblem(req);
  if(!resp.error){
    // return back 200 status code to the client
    res.status(200).json(resp);
  }else if(resp.error){
    // return back 401 status code to the client if Problem is empty
    res.status(401).json(resp);
  }else if(resp === null){
    res.status(407).json({
      error: true,
      message: 'Posting Question is unsuccessful,try after some time.'
    });
  }
});

//Read the port number from env file
const port = process.env.PORT || "3001";
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
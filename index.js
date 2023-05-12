const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());
const USERS = [];
console.log(USERS);
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

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  try {
    // Add logic to decode body

    const { email, password,isAdmin } = req.body;

    // body should have email and password
    if (!email || !password ||!isAdmin) {
      return res.status(404).send({
        message: "Email or Password is not Provided",
      });
    }

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    if (USERS.some((user) => user.email == email)) {
      return res.status(400).send({
        message: "Email already Exist!!!",
      });
    } else {
      USERS.push({ email, password,isAdmin});
      res.status(201).send({
        message: "User Created",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error while creating a User",
    });
  }

  // return back 200 status code to the client
  // res.send('Hello World!')
});

app.post("/login", function (req, res) {
  try {
    // Add logic to decode body
    const {email,password}=req.body;
    // body should have email and password
      if(!email ||!password)
      {
        return res.status(401).send({
          message: "Email or Password is not Provided"
        })
      }
    // Check if the user with the given email exists in the USERS array
    const user=USERS.find(user=>user.email===email)
    if(!user)
    {
        return res.status(401).send({
          message:"Failed!!! Email does not Exist"
        })
    }
    // Also ensure that the password is the same
    if(user.password!==password)
    {
      return res.status(401).send({
        message:"Failed!!! Password is inncorrect"
      })
    }
    else
    {
      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const token="random-token";
      res.status(200).send({
        message:"Login Successfull",
        token:token
      })
    }
    // If the password is not the same, return back 401 status code to the client

   
  } catch (err) {}
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
const problemId=req.query.problemId;
if(!problemId)
{
  return res.status(401).send({
    message:"Problme Id is not Provided"
  })
}
const submission=SUBMISSION.filter(submission=>submission.problemId===problemId);
res.json(submission);
}
)

app.post("/submissions", function (req, res) {
  const {problemId,solution}=req.body;
  if(!problemId || !solution)
  {
    return res.status(400).send({
      message:"Failed!!! problemId or soluition is not provided"
    })
  }
  const isAccepted=Math.random()<0.5;
  SUBMISSION.push({
    problemId,
    solution,
    isAccepted
  });
  res.json({
    message:isAccepted?"Submission Successfull":"Submission is not Successfull"
  })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const isAdmin=(req,res,next)=>{
  const {isAdmin}=req.user;
  if(isAdmin){
    return res.status(400).send({
      message:"Unauthorized Access! You are not an admin."
    })
  }
  next();
}
app.post("/problems",isAdmin,function(req,res){
  const {title,description,testCases}=req.body;
  if(!title || !description || !testCases)
  {
    return res.status(400).send({
      message:"Failed!!! title ,description or testCases is not Provided"
    })
  }

  const id=Math.random().toString(36).substring(2,8);
  QUESTIONS.push({
    id,
    title,
    description,
    testCases
  });
  res.status(201).send({
    id,
    message:"Problem Created Successfully"
  })
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

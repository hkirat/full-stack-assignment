const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const bcrypt = require('bcrypt');
const db =  require('./Database/db')
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
const {userData,questionData} = require("./models/questions");
app.use(bodyParser.json());

 

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

const SUBMISSION = [

]
app.get('',(req,res)=>{
 res.send("Hello There ")
})

app.post("/signup", async (req, res) => {
  const {email,password} = req.body;
try{
  const user=  await userData.findOne({email:email});
     if(user){
      console.log("user is present bruh!!");
      return res.status(400).json({ error: "User already exists" });
     }
     else{
    const newuser = new userData({email,password});
    await newuser.save();
    console.log("new user saved successfully")
    return res.status(200).json({ message: "User registered successfully" });

     }
     
}
catch(error){
  console.log("new user saved successfully",error);
  return res.status(500).json({ error: "Internal server error" });
 
}

})




app.post("/login", async function(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userData.findOne({ email: email });

    if (!user) {
      console.log("User not found!");
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password!");
      return res.status(401).json({ error: "Invalid password" });
    }

    console.log("User logged in successfully!");
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/questions', async(req, res)=> {
  try{
    const question= await questionData.find();
    console.log(question);
    console.log("messi is the goat");
  res.json(question);
  }
  catch(error){
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get("/submissions", function(req, res) {
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {

   const inAccepted = Math.random()<0.5;
   SUBMISSIONS.push({
    data: submissionData,
    accepted: isAccepted,
    timestamp: new Date()
  });

  if (isAccepted) { 
    res.status(200).json({ message: 'Submission accepted successfully' });
  } else {
    res.status(403).json({ message: 'Submission rejected' });
  }
  
  });


const problem =[];
const ADMIN_USER = {
  email: "email123",
  password: "adminpass",
};
const isAdmin = (req,res,next)=>{
 if(req.body.email == ADMIN_USER.email && req.body.password== ADMIN_USER.password){
  next();
 }
 else{
  res.status(403).json({ message: 'Permission denied. Only admins can perform this action.' });
 }
}

app.use(express.json());
app.post("/add",isAdmin,function (req,res){
//  console.log(req.body);
   SUBMISSION.push(req.body);
   console.log(SUBMISSION)
   res.status(200).json({ message: 'Submission accepted successfully' });
// need to understand this thing
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
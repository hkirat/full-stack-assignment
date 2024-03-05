const express = require('express');
const app = express();
const port = 3001;
// JSON body parsor
app.use(express.json());

// Dummy database
const USERS = [{}];

app.get('/',(req,res)=>{
  res.json({message:"This is home page"});
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  // Creating an existing user
  const exisitingUser = USERS.find((user) => user.email === email);
  if (exisitingUser) {
    return res.status(401).json({ message: "User already exists" });
  }
  USERS.push({ email, password });
  // Returning a status
  // Console logging the user object
  console.log(USERS);
  res.status(200).json({ message: "User created Successfully" });
});

app.post('/login',(req,res)=>{
  const {email,password} = req.body;
  const user = USERS.find((user)=>{user.email===email});
  if(!user || user.password !==password){
    return (res.status(403).json({message:"Email not found! Please Sign in first"}));
  }
  // Creating a token 
  const token = Math.random().toString(36).substring(7);
  res.sendStatus(200).json({message:"Login Successful",token});
  console.log(user,token);
})


app.listen(port,()=>{
  console.log(`The server is listening at http://localhost:${port}`);
});
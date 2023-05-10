const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const port = 3000
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

const users = [];
const SOLUTIONS = [];
let mail;

//login route
app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/login.html");
});
app.post('/login',(req,res)=>{
    const mail = req.body.login_email;
    const pass = req.body.login_password;
    // inventory.find(({ name }) => name === "cherries");

    if(users.find(({email_address}) =>mail===email_address)){
        if(users.find(({password})=>pass===password)){
            res.redirect("/qsn");
        }else{
            res.send("Wrong password!");
        }
    }else{
        res.redirect("/");
    }
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

//signup route
app.post("/",(req,res)=>{
    //onclick
    mail = req.body.email;
    const pass = req.body.password;
    const data ={
        email_address:mail,
        password:pass
    }
    users.push(data);
    res.redirect("/qsn");
});

app.get("/qsn",(req,res)=>{
    
    res.sendFile(__dirname+"/qsn.html");
});

app.post("/qsn",(req,res)=>{
    const { solution } = req.body;

    // Mock response, randomly accept or reject the solution
    const isAccepted = Math.random() < 0.5;
    const sol = {
        solu:solution,
        email_address:mail
    }
    // Store the submission in the SUBMISSION array
    SOLUTIONS.push({ sol, accepted: isAccepted });
    console.log(SOLUTIONS);
    res.status(200).send('Submission received');
});

app.get("/sol",(req,res)=>{
    res.send("this is solution page");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
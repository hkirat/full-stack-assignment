const express = require('express')
const app = express()
const port = 3000

const users = [{
    id: "vms@vms.com",
    password: "vvmms"
}];

const QUESTIONS = [{
    title : "Two States",
    description: "Given an array, return the maximum of the array",
    testcases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}]

const SUBMISSONS = [];


app.use(express.urlencoded({extended : true}));


                // ALL GET Request  //


app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/login.html")
})

app.get('/questions' , (req, res) => {
    res.send(QUESTIONS);
})

app.get('/submission', (req,res) => {
    // res.sendFile(__dirname+ "/submission.html")
    res.send(SUBMISSONS);
})


                //  ALL POST Request  //

                //Signup

app.post('/signup', (req, res) =>  {
    
    const uid = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;

   const checkUser = users.find(x => x.id === uid);

   if(checkUser === undefined)
   {
    const newUser = {
        id : uid,
        upassword: password,
        utype: userType
    }
        
    users.push(newUser);
    
    res.status(400);
    res.send('New User Added');
    }
    else{
    }
    res.send('User Already exists');
   })



   //Login

app.post("/login", (req,res) => {
    const uid = req.body.email;
    const password = req.body.password;

    // checking whether given input is present in array or not
    const checkUser = users.find(x => x.id === uid);
    const userIndex = users.findIndex(x => x.id === uid);
    console.log(userIndex);

    if(checkUser === undefined)
    {
        res.send("User Doesn't exists please signup");
    }
    else{
        if(users[userIndex].password === password){
            res.status(200);
            // generating random string
            const r = (Math.random() + 1).toString(36).substring(7);

            if(user[userIndex].utype === "admin"){
            // res.redirect("/") here we could add a path such that only admin can add question 
            }
            else
            res.redirect("/questions")
        }
        else{
            res.status(401);
            res.send("Wrong Credentials")
        }
    }
})

        // Submission

app.post("/submission", (req,res) => {
    const qtitle = req.body.title;
    const code = req.body.code;
    const input = req.body.input;
    const output = req.body.output;

    const submission  = {
        title: qtitle,
        code: code,
        input: input,
        output: output
    }
    // checking whether given input is present in array or not
    const checkQuestioj = QUESTIONS.find(x => x.title === qtitle);
    const questionIndex = QUESTIONS.findIndex(x => x.title === qtitle);

        if(checkQuestioj !== undefined){
        if(QUESTIONS[questionIndex].testcases[0].output === output && QUESTIONS[questionIndex].testcases[0].input === '['+input+']')
        {
            res.send("accepted");
        }
        else{
        res.send("rejected");
        }
    }
    else
    res.send("rejected");
    SUBMISSONS.push(submission);
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

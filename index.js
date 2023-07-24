const express = require("express");
const app = express();
const port = 3001;

const USERS = [{ id: "1", email: "dashdash@gmail.com", password: "yoyo" }];

const ADMINS = [{adminId: "123", email: "cooper@gmail.com", password: "murph"}];

const QUESTIONS = [
	{
		title: "Two states",
		description:
			"Given an array , return the maximum of the array?",
		testCases: [
			{
				input: "[1,2,3,4,5]",
				output: "5",
			},
		],
	},
];

const SUBMISSION = [
  {
    userId: "1",
    questionTitle: "Two states",
    solution: "function max(arr){ return Math.max(...arr) }",
    status: "accepted"
  }
];

app.use(express.json());

// app.get("/deets", (req, res) =>{
//   console.log(QUESTIONS);
//   console.log("////////////////////")
//   console.log(SUBMISSION);
//   console.log("////////////////////");
//   console.log(USERS);
//   res.status(200).send();
// })


app.post("/signup", (req, res) => {
	console.log(req.body);
	const { email, password } = req.body;
	const index = USERS.find((t) => t.email === email);
	if (index) {
		return res.status(401).send({ message: "User already exists" });
	}
	const newUser = {
		id: Math.floor(Math.random() * 1000000),
		email: email,
		password: password,
	};
	USERS.push(newUser);
	res.status(200).send("Account created Successfully");
});

app.post("/login", function (req, res) {
	const { email, password } = req.body;
	const index = USERS.find((t) => t.email === email);

	if (!index) {
		return res.send("User does not exist");
	} else {
		const check = index.password === password;
		if (!check) {
			return res.status(401).send("Enter correct Password");
		}
		res.status(200).send({ token: index.id });
	}
});

app.get("/questions", (req, res) => {
  // console.log(QUESTIONS);
  res.json(QUESTIONS);
});

app.get("/submissions/:title/userId/:userId", function (req, res) {
  const title = req.params.title;
  const userId = req.params.userId;
  const question = SUBMISSION.find(t => t.questionTitle === title && t.userId === userId);
  if(!question){
    return res.status(401).send("No submission done for this problem");
  }
  res.status(200).json(question);
});

app.post("/submissions", function (req, res) {
  const {userId, questionTitle, solution} = req.body;
  const status = Math.random() > 0.5;
  const newSub = {
    userId: userId,
    questionTitle: questionTitle,
    solution: solution,
    status: status
  }
  SUBMISSION.push(newSub);
  if (!status) {
    return res.status(401).send("Your submission was rejected.");
  }
  return res.status(200).send("Your submission was accepted!");
});


app.post("/addquestion", (req, res) => {
  const {adminId, title, description, testCases} = req.body;
  const index = ADMINS.findIndex(t => t.adminId === adminId);
  if(index === -1){
    return res.status(401).send("You are not authorized to add questions");
  }
  const question = {
    title,
    description,
    testCases
  }
  QUESTIONS.push(question);
  return res.status(200).send(`${title} question succesfully added`);
})

app.use((req, res) => {
  res.status(404).send();
});

app.listen(port, function () {
	console.log(`Example app listening on port ${port}`);
});

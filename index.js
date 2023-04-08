const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

const USERS = [];

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

//SIGNUP ROUTE
app.post("/signup", function (req, res) {
	// Add logic to decode body
	// body should have email and password
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(404).json({ Error: "Please enter email and password" });

	//Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
	const emailFound = USERS.find((obj) => obj.email === email);
	if (emailFound) return res.status(404).json({ Error: "Email already in use" });

	USERS.push({ email, password });

	// return back 200 status code to the client
	return res.status(201).json({ Response: "User created successfully" });
});

//LOGIN ROUTE
app.post("/login", function (req, res) {
	// Add logic to decode body
	const { email, password } = req.body;

	// body should have email and password
	if (!email || !password)
		return res.status(404).json({ Error: "Please enter email and password" });

	// Check if the user with the given email exists in the USERS array
	// Also ensure that the password is the same
	const user = USERS.filter((u) => u.email === email)[0];

	if (!user) return res.status(404).json({ Error: "Email not found" });
	console.log(user);
	// If the password is the same, return back 200 status code to the client
	// Also send back a token (any random string will do for now)
	if (user.password === password) return res.status(200).json({ token: "Random String" });
	// If the password is not the same, return back 401 status code to the client
	else return res.status(401).json({ Error: "Incorrect Password" });
});

//QUESTIONS ROUTE
app.get("/questions", function (req, res) {
	//return the user all the questions in the QUESTIONS array
	return res.status(200).json(QUESTIONS);
});

app.get("/submissions/:title", function (req, res) {
	// return the users submissions for this problem
	const { title: quesTitle } = req.params;
	if (!quesTitle) return res.status(404).json({ Error: "Please provide quesTitle" });

	const submissions = SUBMISSION.filter(
		(sub) =>
			sub.quesTitle.toLocaleLowerCase() === quesTitle.split("-").join(" ").toLocaleLowerCase()
	);
	return res.status(200).json(submissions);
});

app.post("/submissions", function (req, res) {
	// let the user submit a problem, randomly accept or reject the solution
	const { quesTitle, email, solution } = req.body;
	if (!quesTitle || !email || !solution)
		return res.status(404).json({ Error: "Please provide quesTitle, email, solution" });
	const answer = Math.random() > 0.5 ? "ACCEPTED" : "REJECTED";
	// Store the submission in the SUBMISSION array above
	SUBMISSION.push({ email, quesTitle, solution });
	return res.status(200).json({ Result: answer });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
	console.log(`Example app listening on port ${port}`);
});

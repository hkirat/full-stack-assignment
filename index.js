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

app.get("/questions", function (req, res) {
	//return the user all the questions in the QUESTIONS array
	res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
	// return the users submissions for this problem
	res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
	// let the user submit a problem, randomly accept or reject the solution
	// Store the submission in the SUBMISSION array above
	res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
	console.log(`Example app listening on port ${port}`);
});

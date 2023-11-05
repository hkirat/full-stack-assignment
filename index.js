const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors({ origin: "*" }));

const JWT_KEY = "secret-key";
const USERS = []; // user, password, role, token
let QUESTION_ID = 2;

const QUESTIONS = [
	{
		id: 1,
		title: "Array Max Value",
		description: "Return The Max Value Of The Given Array",
		testCases: [
			{
				input: "[1, 2, 3, 4, 5]",
				output: "5",
			},
		],
		acceptance: "55%",
		difficulty: "Easy",
	},
];

const SUBMISSIONS = []; // username, problemId, code, accepted

// Check How To Implement A Middleware Correctly
// Auth Middleware
function authRequired(req, res, next) {
	for (const user of USERS) {
		if (user.token === req.headers.token) {
			return next();
		}
	}
	res.status(401).json({ error: "The User Must Be Logged-In" }); // 401 Unauthorized
}

app.get("/", function (req, res) {
	res.status(200).send("Home"); // 200 OK
});

app.get("/allDetails", authRequired, function (req, res) {
	res.status(200).send({ USERS, QUESTIONS, SUBMISSIONS });
});

app.post("/signup", function (req, res) {
	const { username, password, role } = req.body;
	if (!username || !password) {
		res.status(400).send({
			error: "Both Username And Password Are Required",
		}); // 400 Bad Request
	}

	const user = USERS.find((user) => user.username === username);
	const token = jwt.sign({ username }, JWT_KEY);

	if (!user) {
		USERS.push({ username, password, role: role, token: token });
		res.status(200).send({ message: "Sign-Up Successful!", token: token });
	} else {
		res.status(401).send({ error: "User Already Exists" });
	}
});

app.post("/login", function (req, res) {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).send({
			error: "Both Username And Password Are Required",
		});
	}

	const user = USERS.find((user) => user.username === username);

	if (user && user.password === password) {
		res.status(200).send({ message: "Login Successful!", token: user.token });
	} else {
		res.status(401).send({ error: "Incorrect Credentials" });
	}
});

// app.get("/problem/:id", authRequired, function (req, res) {
app.get("/problem/:id", function (req, res) {
	const id = parseInt(req.params.id);
	const question = QUESTIONS.find((question) => question.id === id);
	if (question) {
		res.status(200).json(question);
	} else {
		res.status(404).send({
			error: `The Question With ID ${id} Does Not Exist`,
		}); // 404 HTTP Resource Not Found
	}
});

// app.get("/problemset/all", authRequired, function (req, res) {
app.get("/problemset/all", function (req, res) {
	res.status(200).json(QUESTIONS);
});

// app.get("/submissions", authRequired, function (req, res) {
app.get("/submissions", function (req, res) {
	const { username } = req.body;
	const userSubmissions = SUBMISSIONS.filter(
		(submission) => submission.username === username
	);
	res.status(200).json(userSubmissions);
});

// app.post("/submissions", authRequired, function (req, res) {
app.post("/submissions", function (req, res) {
	const { username, problemId, code } = req.body;
	const accepted = Math.random() > 0.5;

	SUBMISSIONS.push({ username, problemId, code, accepted });
	if (accepted) {
		res.status(200).send({ message: "The Submitted Code Is Correct" });
	} else {
		res.status(200).send({ message: "The Submitted Code Is Incorrect" });
	}
});

// app.post("/newproblem", authRequired, function (req, res) {
app.post("/newproblem", function (req, res) {
	const { role, title, description, testCases, acceptance, difficulty } =
		req.body;
	const id = QUESTION_ID++;

	if (role === "admin") {
		QUESTIONS.push({
			id,
			title,
			description,
			testCases,
			acceptance,
			difficulty,
		});
		res.status(200).send({ message: "New Question Added Successfully!" });
	} else {
		res.status(403).send({ error: "Access Denied" }); // 403 Forbidden
	}
});

app.listen(port, function () {
	console.log(`App Listening On Port ${port}`);
});

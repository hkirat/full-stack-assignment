const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
app.use(express.json());

const JWT_KEY = "secret-key";
const USERS = []; // user, password, role, token

const QUESTIONS = [
	{
		id: Math.random().toString().replace("0.", "").substring(0, 7),
		title: "Array Max Value",
		description: "Return The Max Value Of The Given Array",
		testCases: [
			{
				input: "[1, 2, 3, 4, 5]",
				output: "5",
			},
		],
	},
];

const SUBMISSIONS = []; // username, problemId, code, accepted

function isUserLoggedIn(token) {
	let loggedIn = false;
	for (const user of USERS) {
		if (user.token === token) {
			loggedIn = true;
		}
	}

	return loggedIn;
}

app.get("/", function (req, res) {
	res.status(200).send("Home"); // OK
});

app.get("/allDetails", function (req, res) {
	const allDetails = { USERS, QUESTIONS, SUBMISSIONS };
	const loggedIn = isUserLoggedIn(req.headers.token);

	if (loggedIn) {
		res.status(200).json(allDetails);
	} else {
		res.status(401).send({ error: "The User Must Be Logged-In" }); // Unauthorized
	}
});

app.post("/signup", function (req, res) {
	const { username, password, role } = req.body;
	if (!username || !password) {
		res.status(400).send({
			error: "Both Username And Password Are Required",
		}); // Bad Request
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

app.get("/questions", function (req, res) {
	const loggedIn = isUserLoggedIn(req.headers.token);

	if (loggedIn) {
		res.status(200).json(QUESTIONS);
	} else {
		res.status(401).send({ error: "The User Must Be Logged-In" });
	}
});

app.get("/submissions", function (req, res) {
	const { username } = req.body;
	const userSubmissions = SUBMISSIONS.filter(
		(submission) => submission.username === username
	);
	const loggedIn = isUserLoggedIn(req.headers.token);

	if (loggedIn) {
		res.status(200).json(userSubmissions);
	} else {
		res.status(401).send({ error: "The User Must Be Logged-In" });
	}
});

app.post("/submissions", function (req, res) {
	const { username, problemId, code } = req.body;
	const accepted = Math.random() > 0.5;
	const loggedIn = isUserLoggedIn(req.headers.token);

	if (loggedIn) {
		SUBMISSIONS.push({ username, problemId, code, accepted });
		if (accepted) {
			res.status(200).send({ message: "The Submitted Code Is Correct" });
		} else {
			res.status(200).send({ message: "The Submitted Code Is Incorrect" });
		}
	} else {
		res.status(401).send({ error: "The User Must Be Logged-In" });
	}
});

app.post("/newproblem", function (req, res) {
	const { role, title, description, testCases } = req.body;
	const id = Math.random().toString().replace("0.", "").substring(0, 7);
	const loggedIn = isUserLoggedIn(req.headers.token);

	if (loggedIn) {
		if (role === "admin") {
			QUESTIONS.push({ id, title, description, testCases });
			res.status(200).send({ message: "New Question Added Successfully!" });
		} else {
			res.status(403).send({ error: "Access Denied" }); // Forbidden
		}
	} else {
		res.status(401).send({ error: "The User Must Be Logged-In" });
	}
});

app.listen(port, function () {
	console.log(`App listening on port ${port}`);
});

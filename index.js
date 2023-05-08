const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const USERS = []

const QUESTIONS = [
	{
		title: 'Two states',
		description: 'Given an array , return the maximum of the array?',
		testCases: [
			{
				input: '[1,2,3,4,5]',
				output: '5',
			},
		],
	},
]

const SUBMISSION = []

// regex
const emailRegex = new RegExp(
	/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
)
const passwordRegex = new RegExp(
	/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
)

const generateRandomString = () => {
	const length = 64
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	let result = ''

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}

	return result
}

app.post('/signup', function (req, res) {
	// retrive user details
	const { name, email, password } = req.body

	// regex matching
	const isValidEmail = emailRegex.test(email)
	const isValidPassword = passwordRegex.test(password)

	// validators
	if (name === '')
		res.status(401).json({ message: 'Please provide a valid name' })
	if (!isValidEmail)
		res.status(401).json({ message: 'Please provide a valid email' })
	if (!isValidPassword)
		res.status(401).json({ message: 'Please provide a strong password' })

	// filter user
	const filteredUser = USERS.filter((user) => user.email === email)

	// check weather if a user exists or not
	if (filteredUser.length === 0) USERS.push(req.body)
	else res.status(401).json({ message: 'User already exists' })

	res.status(200).json({ message: 'new user has been created' })
})

app.post('/login', function (req, res) {
	// retrive user credentials
	const { email, password } = req.body

	// filter user
	const filteredUser = USERS.filter((user) => user.email === email)

	// validators
	if (filteredUser.length === 0)
		res.status(401).json({ message: 'Invalid email id' })
	if (password !== filteredUser[0].password)
		res.status(401).json({ message: 'Invalid password' })

	// generate token
	let token = generateRandomString()

	// append token to user
	let index = USERS.findIndex((user) => user.email === email)
	USERS[index].token = token

	// send token
	res.status(200).json({ token })
})

app.get('/questions', function (req, res) {
	const { token } = req.headers

	const filteredUser = USERS.filter((user) => user.token === token)
	console.log(filteredUser)

	if (filteredUser.length > 0) res.status(200).json({ QUESTIONS })
	else res.status(403).json({ message: 'Invalid token' })
})

app.get('/submissions', function (req, res) {
	// return the users submissions for this problem
	res.send('Hello World from route 4!')
})

app.post('/submissions', function (req, res) {
	// let the user submit a problem, randomly accept or reject the solution
	// Store the submission in the SUBMISSION array above
	res.send('Hello World from route 4!')
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
	console.log(`Example app listening on port ${port}`)
})

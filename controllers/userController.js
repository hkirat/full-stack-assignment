// Define USERS array to store email and password
// Define USERS array with email and hashed password

const USERS = [
  {
    email: 'user1@example.com',
    password: '$2b$10$U6W8zkvux1I6BcwOjKbSJOA2hdKjDixccu.zMrrfDWzIs/dhPLwmu',
  },
];

const TOKENS = {}; // Initialize an object to store tokens

exports.signup = (req, res) => {
  // Decode body
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    // If user already exists, return 409 Conflict status code and error message
    return res.status(409).send('User with this email already exists');
  }

  // Add user to USERS array
  USERS.push({ email, password });

  // Return 200 status code and success message
  res.status(200).json(USERS);
};

exports.login = (req, res) => {
  const email = req.body.email; // Get the email from the request body
  const password = req.body.password; // Get the password from the request body

  // Find the user with the provided email in the USERS array
  const user = USERS.find((user) => user.email === email);

  // If the user is not found, return a 401 Unauthorized response
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // If the password is incorrect, return a 401 Unauthorized response
  if (user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  // Generate a random token and store it in the TOKENS object for the user
  const token = Math.random().toString(36).substr(2);
  TOKENS[token] = user.email;

  // Return a JSON response with the token and a status code of 200
  res.status(200).json({ token });
};

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successfull',
  });
};

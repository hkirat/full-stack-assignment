# full-stack-assignment
-> This file is a Node.js server implementation using the Express framework. It defines various routes that allow users to perform certain actions like sign up, log in, view questions, view submissions, and add new problems.

-> The app variable is created by invoking the express function, which creates an instance of the Express application.

-> The USERS, QUESTIONS, SUBMISSION, and PROBLEMS arrays are used to store data for various functionalities.

-> The server defines four routes using the app.get and app.post methods:

-> /signup - handles POST requests for user sign-up. The user provides an email and password. The server checks if the user already exists in the USERS array, and if not, adds the new user. Returns a 200 status code if successful, and a 400 status code with an error message otherwise.

-> /login - handles POST requests for user login. The user provides an email and password. The server checks if the user exists in the USERS array, and if so, checks if the provided password matches. If successful, returns a random token as a JSON response that can be used for authentication. Otherwise, returns a 401 status code with an error message.

-> /questions - handles GET requests for viewing all questions stored in the QUESTIONS array. Returns a JSON response containing the questions and a success message.

=> /submissions - handles GET and POST requests for viewing and adding submissions. GET requests return a success message, while POST requests add a new submission to the SUBMISSION array and return a response indicating whether the submission was accepted or rejected.

-> /problems/new - handles POST requests for adding new problems. The user provides a title, description, and difficulty level. The server checks if the user is an admin, and if so, adds the new problem to the PROBLEMS array. Returns a 201 status code with a success message and the new problem object if successful, and a 401 status code with an error message otherwise.

-> The server listens for incoming requests on port 300

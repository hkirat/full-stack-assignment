# Full Stack Assignment
This repository contains the code for a full stack web application that allows users to sign up, log in, view questions, and submit solutions. It is built using the Express framework in Node.js for the backend, and uses HTML, CSS, and JavaScript for the frontend.

## Getting Started
To get started with the application, follow these steps:

1. Clone the repository to your local machine using git clone https://github.com/hkirat/full-stack-assignment.git
2. Navigate to the repository directory using cd full-stack-assignment
3. Install the required dependencies using npm install
4. Start the application using npm start
5. Open a web browser and navigate to http://localhost:3001

## Usage

Once the application is running, you can use the following routes to interact with it:

* POST /signup: Allows users to sign up by providing an email address and password. If the email address is not already in use, the user is added to the system and a token is returned. If the email address is already in use, an error is returned.
* POST /login: Allows users to log in by providing an email address and password. If the email address and password match an existing user, a token is returned. If the email address or password is incorrect, an error is returned.
* GET /questions: Returns a list of questions that users can attempt to solve. Each question has a title, description, and test cases.
* GET /submissions: Returns a list of the user's submissions for each question, along with whether each submission was accepted or rejected.
* POST /submissions: Allows users to submit a solution to a question. The solution is randomly accepted or rejected, and the result is returned.



## Contributing

If you would like to contribute to the development of the application, feel free to submit a pull request. However, please note that this is a demo application and is not actively maintained.

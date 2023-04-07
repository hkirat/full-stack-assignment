# Welcome to the Full Stack Web Development Assignment Repository!

This repository contains a starter code for a simple HTTP server backend using Express JS. The goal of this assignment is to implement the missing functionalities in the server and create a pull request with your solution.

<hr>

## Setup
Before starting with the assignment, you need to set up the development environment. You need to have the following software installed on your machine:

- Node.js v14 or higher
- Git

### To set up the development environment, follow these steps:

- Clone the repository using Git.
- Open a terminal and navigate to the project directory.
- Run **npm install** to install the required packages.

### Running the server
- To run the server, open a terminal in the project directory and run **node index.js**. The server will start running on **localhost:3001**.

<hr>


 
## Assignment
The server is a basic skeleton of an HTTP server that has several routes defined. Your task is to implement the missing functionalities for the routes defined in the **index.js** file. Specifically, you need to implement the following functionalities:

### Route /signup
- POST:
  - Decode the body of the request.
    - body should have email and password.
  - Check if the user with the given email exists in the USERS array.
    - If the user with the given email already exists, return a 409 status code to the client.
    - If not, add the user with their email and password to the USERS array and return a 200 status code to the client.
  
### Route /login
- POST:
  - Decode the body of the request.
    - body should have email and password.
  - Check if the user with the given email exists in the USERS array. 
    - If email doesn't exists in USERS array, return a 401 status code to the client.
  - If the user with the given email exists, check if the password matches. 
      - If password doesn't match , return a 401 status code to the client.
  - If the email and password are correct.
    - return a 200 status code to the client, along with a randomly generated string token.
  
### Route /questions
- GET: 
  - Return all the problems in the QUESTIONS array to the client.
- POST: 
    - This route should only be accessible to admins.
    - Decode the body of the request. 
    - Add the new problem to the QUESTIONS array.
  
### Route /submissions
- GET: 
  - Return all the submissions in the SUBMISSION array to the client.
- POST: 
  - Decode the body of the request. 
  - Store the submission in the SUBMISSION array. 
  - Randomly accept or reject the solution.
   
<hr>  
## Submission
To submit your solution, follow these steps:

1. Implement the missing functionalities in the server code.
2. Test your implementation by running the server and making requests to it using a tool like Postman.
3. Create a new branch in the repository with a descriptive name (e.g., **`solution-to-assignment`**).
4. Commit your changes to the branch.
5. Push the branch to the repository.
6. Create a pull request from your branch to the main branch of the repository.
7. Wait for [hkirat](https://github.com/hkirat) to review your pull request and provide feedback.
8. Good luck with the assignment! If you have any questions or need help, feel free to reach out to [hkirat](https://github.com/hkirat) or create an issue in the repository.
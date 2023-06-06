# Express API Example

This is an example Express API project that demonstrates user authentication, question submission, and submission management.

## API Endpoints

### Sign Up

- Endpoint: `POST /signup`
- Description: Allows a user to sign up by providing an email and password.

### Login

- Endpoint: `POST /login`
- Description: Allows a user to log in by providing their email and password.

### Submissions

- Endpoint: `GET /submissions`
- Description: Retrieves the user's submissions for a specific problem.

- Endpoint: `POST /submissions`
- Description: Allows a user to submit a problem solution, with the solution being randomly accepted or rejected.

### Questions

- Endpoint: `GET /questions`
- Description: Retrieves a list of questions.

- Endpoint: `POST /questions`
- Description: Allows an admin to add a new question.

## Getting Started

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Start the server using `npm start`.
4. The API will be available at `http://localhost:3001`.

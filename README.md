# Documentation

This code is a simple backend application that provides endpoints for signing up, logging in, fetching and submitting questions, and submitting code for evaluation. The application uses the Express.js framework and handles data in memory.

## Endpoints

### `POST /signup`

This endpoint is used to register new users. The endpoint requires the following fields in the request body: `email` and `password`. The optional field `isAdmin` can also be set to true for admin users. Upon successful registration, a `200` status code and a message indicating success is returned. If the request is invalid or a user with the given email already exists, an error is returned.

### `POST /login`

This endpoint is used to log in existing users. The endpoint requires the following fields in the request body: `email` and `password`. Upon successful login, a `200` status code, a message indicating success, and a login token is returned. If the request is invalid or the user credentials are incorrect, an error is returned.

### `GET /questions`

This endpoint is used to retrieve the list of questions. The endpoint requires a valid login token in the request body to access. Upon successful retrieval, a `200` status code and the list of questions is returned. If the request is invalid or the user is not logged in, an error is returned.

### `GET /submissions`

This endpoint is used to retrieve the list of code submissions. The endpoint requires a valid login token in the request body to access. Upon successful retrieval, a `200` status code and the list of code submissions is returned. If the request is invalid or the user is not logged in, an error is returned.

### `POST /submissions`

This endpoint is used to submit code for evaluation. The endpoint requires the following field in the request body: `code`. Upon successful submission, a `200` status code and a message indicating success or failure is returned. Submissions are randomly accepted or rejected for demonstration purposes.

### `POST /questions`

This endpoint is used to submit new questions. The endpoint requires the following fields in the request body: `token` and `question`. The `token` field is a valid login token of an admin user, and the `question` field is an object that contains the fields `title`, `description`, and `testCases`. Upon successful submission, a `200` status code and a message indicating success is returned. If the request is invalid, the user is not logged in, or the user is not an admin, an error is returned.

## Middleware

The application uses two middleware functions, `express.json()` and `express.urlencoded()`, to parse incoming requests that have a JSON or URL-encoded body. This middleware is applied to all endpoints.

## Data

The application stores three arrays in memory: `USERS`, `SUBMISSIONS`, and `QUESTIONS`. The `USERS` array contains registered users, the `SUBMISSIONS` array contains submitted code, and the `QUESTIONS` array contains submitted questions. The application also stores a map of `TOKENS` to keep track of login tokens and the associated email of the user.

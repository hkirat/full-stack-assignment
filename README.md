
# Full Stack Assignment

This repository contains the code for a full stack assignment. It includes a server built with Express.js and uses JSON Web Tokens (JWT) for authentication.

## Installation

To run the server locally, follow these steps:

1. Clone the repository.
2. Install the dependencies by running `npm install`.
3. Create a `.env` file and add the necessary environment variables.
4. Start the server by running `npm start`.

## Endpoints

### POST /signup

This endpoint is used for user registration. It expects a JSON body with the following fields:

- `email` (string): The user's email address.
- `password` (string): The user's password.

If the user is successfully registered, a 200 status code is returned with the message "User created successfully". If the user already exists, a 400 status code is returned with the message "User already exists".

### POST /login

This endpoint is used for user login. It expects a JSON body with the following fields:

- `email` (string): The user's email address.
- `password` (string): The user's password.
- `tokem` : create it for future verification

If the login is successful, a 200 status code is returned with the following JSON response:

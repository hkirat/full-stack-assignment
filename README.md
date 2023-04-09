full-stack-assignment
=====================

Description
-----------

This project is a web application that allows users to register, authenticate, create, read, update, and delete questions and answers. It includes a server-side API built with Node.js and Express.js, and uses JSON files as databases for storing user data, question data, and answer data.

Installation
------------

To run this project, you will need to have Node.js installed on your machine. You can download it from the official website: <https://nodejs.org/>

To install the project dependencies, run the following command in your terminal:

Copy code

`npm install`

Usage
-----

To start the server, run the following command:

sqlCopy code

`npm start`

The server will start listening on port 3000 by default.

Dependencies
------------

This project uses the following dependencies:

-   Express.js: A web application framework for Node.js.
-   Body-parser: A middleware for parsing incoming request bodies.
-   Cookie-parser: A middleware for handling cookies.
-   Jsonwebtoken: A library for generating and verifying access and refresh tokens.

Project structure
-----------------

The project has the following structure:

-   `app.js`: The main entry point of the application.
-   `routes/`: Contains the route definitions for the application.
-   `models/`: Contains the database models and data loading functions.
-   `public/`: Contains the static files served by the application.
-   `views/`: Contains the HTML templates used by the application.

Routes
------

The application defines the following routes:

-   `/signup`: Handles user registration.
-   `/login`: Handles user authentication.
-   `/questions`: Handles CRUD operations on questions.
-   `/answers`: Handles CRUD operations on answers.

Middleware
----------

The application uses the following middleware:

-   `bodyParser`: Parses incoming request bodies.
-   `cookieParser`: Handles cookies.
-   `static`: Serves static files.
-   `auth`: Checks whether a user is authorized to access a certain resource.

Helpers
-------

The application uses the following helper functions:

-   `bcrypt.hash`: A function for password encryption.
-   `jsonwebtoken`: A library for generating and verifying access and refresh tokens.

Error handling
--------------

The application uses an error handling middleware to handle errors.

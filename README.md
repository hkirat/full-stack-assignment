# Harkirat singh full-stack-web-dev RoadMap
I took this assignment as a hackathon challenge and solved it in 8.3 hours .

## API Reference

#### Question

```http
  GET https://127.0.0.1:3000/api/v1/subscriber/

```

| Method | URL     | Description                |
| :-------- | :------- | :------------------------- |
| `POST` | `{{URL}}api/v1/subscriber/questions` |Ask Question to chatgpt in req.body and it returns curated crisp AI answer. |
| `PATCH` | `{{URL}}api/v1/subscriber/submissions` |Submit Question in req.body and It stores in  database. |
| `GET` | `{{URL}}api/v1/subscriber/questions` |It return all my question from database .|
| `POST`| `{{URL}}api/v1/subscriber/submissions` |It validates the question based on whether It is asked previously or not . |
| `POST` | `{{URL}}api/v1/subscriber/convert-question` | It returns nicely formatted html of the leetcode question url (for frontend developer) . |







#### Authentication

```http
  POST https://127.0.0.1:3000/api/v1/subscriber/

```

| Method | URL     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `POST`      | `{{URL}}/api/v1/subscriber/signup` | **SIGNUP** Sign up providing your name, email, and password. You can set your profile picture later.|
| `POST`      | `{{URL}}/api/v1/subscriber/login` | **LOGIN** Login using your email and password. Your session will last 5 days, after that you'll have to login again.|
| `GET`      | `{{URL}}/auth/google` | **SIGNUP** It signup's using your google account |




## Main Tools And Technologies Used:

- HTML (Create the structure and content of the web pages).
- CSS (Styling of the web pages).
- JAVASCRIPT (Interactivity, as well as making requests to the API from the client-side).
- NODE (Run JavaScript code on the server-side).
- EXPRESS (Node framework, meant to simplify the process of building complex server-side applications).
- MONGODB (Database for data persistence).
- MONGOOSE (Interacting with mongodb).
- JSON WEB TOKEN (Authenticating users).




## Setting Up Your Local Environment

If you wish to play around with the code base in your local environment, do the following

```bash
  * Clone this repo to your local machine.
* Using the terminal, navigate to the cloned repo.
* Install all the neccessary dependencies, as stipulated in the package.json file.
* If you don't already have one, set up accounts with: MONGODB, POSTMAN ,EXPRESS. Please ensure to have at least basic knowledge of how these services work.
* In your .env file, set environment variables for the following:
    * DATABASE=your mongodb database url
    * DATABASE_PASSWORD=your mongodb password

    * SECRET=your json web token secret
    * JWT_EXPIRES_IN=90d
    * JWT_COOKIE_EXPIRES_IN=90

* Start the server.
- $npm init
- $npm Install
- $npm start /node server.js 
* Your app should be running just fine.


## Contributing :

Contributions are always welcome , Implementing It's frontend would be great .

# Anyway subscribe to Harkirat https://www.youtube.com/@harkirat1

const express = require('express');
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];



const SUBMISSIONS = [

]
/* Understaning how POST works
When you click the submit button, the browser captures the event and triggers the form submission process.

The browser collects all the form data, including the values entered in input fields, checkboxes, etc.

The browser constructs an HTTP POST request internally.

The request includes the following components:

The URL to which the form should be submitted. This is specified by the action attribute of the <form> element.
The HTTP method, which is set to POST in this case.
The request headers, such as Content-Type, that indicate the format of the data being sent.
The request body, which contains the form data encoded in a specific format, such as URL-encoded or multipart form data.
The browser opens a network connection to the server using the URL provided in the form's action attribute.

The browser sends the constructed HTTP POST request to the server over the established network connection.

The request travels through the network infrastructure, including routers and switches, until it reaches the server that corresponds to the URL.

The server receives the HTTP POST request and processes it based on the specified route and handler.

The server performs any necessary operations, such as validating the data, saving it to a database, or executing business logic.

The server generates an HTTP response, which includes the appropriate response status code (e.g., 200 for success, 400 for bad request).

The server sends the response back to the browser over the network connection.

The browser receives the response and processes it based on the response headers and content type.

The browser may perform actions based on the response, such as displaying a success message, redirecting to another page, or updating the current page.

So, in summary, when you click the submit button in a form, the browser constructs an HTTP POST request with the form data, sends it to the server, and processes the response received from the server. The browser handles the network communication and manages the request-response cycle on your behalf.
*/
/*res (Response object):
res.send(): Sends a response back to the client.
res.json(): Sends a JSON response back to the client.
res.status(): Sets the HTTP status code of the response.
res.redirect(): Redirects the client to a different URL.
res.render(): Renders a view template and sends it as the response.
res.sendFile(): Sends a file as the response to the client.
res.cookie(): Sets a cookie in the response.
res.clearCookie(): Clears a previously set cookie.
res.set(header, value): Sets a specific header in the response.
res.get(header): Retrieves the value of a specific header from the response.
res.download(): Initiates a file download by sending the file as the response.
res.type(): Sets the Content-Type header of the response.
res.locals: Provides a way to pass data from middleware to the view template.
*/
/*req (Request object):
req.params: Retrieves the route parameters specified in the URL path.
req.query: Retrieves the query parameters from the URL.
req.body: Retrieves the data sent in the request body (requires body-parser middleware).
req.headers: Retrieves the headers sent in the request.
req.cookies: Retrieves the cookies sent in the request.
req.session: Provides access to the session object for the current user (requires session middleware).
req.url: Retrieves the URL of the current request.
req.method: Retrieves the HTTP method used in the request (e.g., GET, POST, PUT, DELETE).
req.path: Retrieves the path portion of the URL.
req.protocol: Retrieves the protocol used in the request (e.g., http or https).
req.get(header): Retrieves the value of a specific header from the request.
*/





app.post('/signup', function(req, res) {

// Add logic to decode body
  // body should have email and password
  const email = req.body.email
  const password = req.body.password
  // or const {email, password} = req.body
  const userExists = USERS.some(user => user.email === email) // USERS is the array defined above which stores every new sign up. So here it is checking whether the userid already exists or not.
  if(userExists){
    return res.status(400).send('User already exists')
  }else{ 
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push({email,password})
    // return back 200 status code to the client
    return res.status(200).send('You are now signed in with new userID ' + email)
  }
 
  //res.send('Hello World!')
})







app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body
  // Check if the user with the given email exists in the USERS array
  const userExists = USERS.some(user => user.email === email)
  const userPassword = USERS.some(user => user.password === password)
  if(!userExists) {
    return res.status(400).send('User does not exist')
  }else{
    // Also ensure that the password is the same
    if(!userPassword){
      // If the password is not the same, return back 401 status code to the client
      return res.status(401).send('Invalid password')
    }else{
      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const token = 'You are now logged in with your email '
      return res.status(200).json({token})
    }
  }

  // res.send('Hello World from route 2!')
})







/*Understanding how GET works
When you enter a URL in the address bar of your web browser or click a link, you initiate an HTTP GET request to the server.

The GET request is one of the HTTP methods used for retrieving data from a server. It is the most common method used by web browsers to request web pages, images, stylesheets, JavaScript files, and other resources.

The URL you enter or click contains the address of the server and the specific path or resource you want to access. For example, it could be https://www.example.com/page.

When you press Enter or click a link, your web browser starts the process of sending an HTTP GET request to the server. It establishes a connection with the server using the HTTP protocol.

The GET request consists of several components. It includes the HTTP method, which is set to GET. It also includes the URL or endpoint you want to access, such as /page in our example.

Once the request is prepared, the browser sends it over the internet to the server using the appropriate network protocols, such as TCP/IP.

The GET request travels through the network infrastructure until it reaches the server that corresponds to the URL you entered.

The server receives the GET request and processes it based on the specified route or endpoint.

The server retrieves the requested resource, such as an HTML page or an image, and prepares a response.

The server generates an HTTP response, which includes the requested resource, along with other response headers, such as content type and status code.

The server sends the response back to the browser over the established network connection.

The browser receives the response and interprets it based on the content type and other headers provided by the server. For example, if the response is an HTML page, the browser renders the page and displays it to you.

If the page contains additional resources, such as images, stylesheets, or JavaScript files, the browser may issue separate GET requests to fetch those resources.

The browser may also cache the response, depending on the cache headers sent by the server, to optimize future requests for the same resource.

In summary, the HTTP GET request is used by the browser to request resources from a server. The browser sends the request, and the server responds with the requested resource, which the browser interprets and renders to display the web page or retrieve other necessary resources.
*/
app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({QUESTIONS})
  //res.send("Hello World from route 3!")
})

app.get("/usersSubmissions", function(req, res) {
  // return the users submissions for this problem
  res.status(200).json({SUBMISSIONS})
  //res.send("Hello World from route 4!")
});





app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const submit = Math.random() * 100 < 50
   if(submit){
    res.status(200).send('Accepted')
   }else{
    res.status(200).send('Rejected')
   }
   // Store the submission in the SUBMISSION array above things like solution, time, accepted or rejected, 
   const submission = {
    question: req.body.question,
    solution: req.body.solution,
    accepted: submit,
    time: new Date()
   }
   SUBMISSIONS.push(submission)
  //res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post('/addingQuestions', function(req,res){
  // ensure that only admins can do that.
  const question ={
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases,
    time: new Date()
  }
  //In summary, req.body.user refers to a property within the req.body object, while req.user typically represents the authenticated user in an Express.js application, but it is not a standard property and its usage depends on your authentication implementation.
  //const user = req.body.user
  const user = req.user
  const admin = req.user.admin // inside user object admin is its property here
  const isAdmin = USERS.some(user => user===admin) // or req.user === req.user.admin
  if(!isAdmin) {
    return res.status(401).send('Only admin can add questions')
  }
  QUESTIONS.push(question)
  return res.status(200).send('Your question has been added successfully ')
})

/*Understanding how listen works
In your server-side code, after setting up your Express application and defining the necessary routes and middleware, you call the listen method on your server object.

The listen method instructs the server to start listening for incoming network requests on a specified port number.

When you call listen, you provide the port number as an argument. For example, app.listen(3000) tells the server to listen for requests on port 3000.

Once the server starts listening, it creates a network socket and binds it to the specified port number. This allows the server to receive incoming network requests sent to that port.

The server is now in a listening state, ready to accept incoming requests from clients.

When a client sends an HTTP request to the server's IP address and the specified port number, it establishes a network connection with the server.

The client's request, which includes information such as the HTTP method (e.g., GET, POST), the requested URL path, and other headers or data, is sent to the server over the network connection.

The server's operating system, upon receiving the incoming request on the specified port, forwards the request to your server application.

Your Express application processes the incoming request based on the defined routes and middleware.

If a matching route is found, the associated route handler function is executed. This function performs the desired logic, such as fetching data from a database, generating a response, or executing business operations.

The handler function generates an HTTP response, including the appropriate response headers (e.g., Content-Type) and content.

The server sends the response back to the client over the established network connection.

The client's browser receives the response and processes it according to the response headers and content type.

The client's browser may display the received content, execute JavaScript code embedded in the response, or perform other actions based on the response.

The server remains in the listening state, ready to handle additional incoming requests.

In summary, the server's listen request establishes a network socket and instructs the server to start listening for incoming requests on a specified port. When a client sends an HTTP request to the server, the server's application processes the request, generates a response, and sends it back to the client. The server continues to listen for further requests, allowing ongoing communication between clients and the server.
*/

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
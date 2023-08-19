const userData = {
  username : "user2",
  email : "user2@email.com",
  password : "pass789"
}// the data will be received here through DOM manipulation after the form submission of the htmlfile

fetch('/signup', {
  method: 'POST',
  headers: {
    'Content-Type' : 'application/json'
  },
  body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
  console.log(data);
});

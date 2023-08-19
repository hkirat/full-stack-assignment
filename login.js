const userData = {
  email: 'user1@email.com',
  password: 'pass123'
};// the data will be received here through DOM manipulation after the form submission of the htmlfile

fetch('/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
  console.log(data);
});

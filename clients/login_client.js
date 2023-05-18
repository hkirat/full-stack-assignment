const userData = { 
    email: "swanandpande1@gmail.com",
    password: "123456"
}

fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
      console.log('User login successful!');
    } else {
      console.log('User login failed.');
    }
  })
  .catch(error => {
    console.error('Error logging up user:', error);
  });
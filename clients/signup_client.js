const userData = { 
    email: "swanandpande1@gmail.com",
    password: "123456"
}

fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
      console.log('User signup successful!');
    } else {
      console.log('User signup failed.');
    }
  })
  .catch(error => {
    console.error('Error signing up user:', error);
  });
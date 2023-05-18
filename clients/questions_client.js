
fetch('http://localhost:3000/questions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (response.ok) {
        return response.json();
    } else {
      console.log('No questions found!');
    }
  })
  .then(data => {
    console.log(data);})
  .catch(error => {
    console.error('Error getting questions:', error);
  });
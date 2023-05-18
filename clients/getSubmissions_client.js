const userData = { 
    email: "swanandpande1@gmail.com",
    title: "Two states"

}

fetch('http://localhost:3000/getsubmissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
        return response.json();
    } else {
      console.log('No submissions found!');
    }
  })
  .then(data => {
    console.log(data.submission,data.accepted);})
  .catch(error => {
    console.error('Error getting submissions:', error);
  });
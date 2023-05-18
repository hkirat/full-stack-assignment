const userData = { 
    email: "swanandpande1@gmail.com",
    title: "Two states",
    submission: "function max(arr){return Math.max.apply(null,arr)}"

}

fetch('http://localhost:3000/postsubmissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
      console.log('Submissions submitted!');
    } else {
      console.log("Couldn't submit!");
    }
  })
  .catch(error => {
    console.error('Error submitting:', error);
  });
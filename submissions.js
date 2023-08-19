// const questions = require('./questions');

// const problemTitle = document.queryselector('#problemTitle');
// const problemDescription = document.queryselector('#problemDescription');

// problemTitle.textContent = questions[0].title;
// problemDescription.textContent = questions[0].description;
// console.log(questions[0].title);

// submission.js

// Fetch coding problem data
fetch('/submissions')
  .then(response => response.json())
  .then(data => {
    // Assuming data is an array of coding problems
    data.forEach(problem => {
      // Create elements for question title and submission textarea
      const questionTitle = document.createElement('h2');
      questionTitle.textContent = problem.title;
      
      const submissionTextarea = document.createElement('textarea');
      submissionTextarea.placeholder = 'Write your code here...';
      
      // Append elements to the designated section in your HTML
      const section = document.querySelector('#submission-section');
      section.appendChild(questionTitle);
      section.appendChild(submissionTextarea);
    });
  });

// Attach event listener for code submission
document.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const submittedCode = event.target.querySelector('textarea').value;
  
  // Send submitted code to the server
  const response = await fetch('/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: submittedCode })
  });
  
  // Handle the server's response as needed
});

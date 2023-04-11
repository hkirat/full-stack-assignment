const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { app, SUBMISSIONS, QUESTIONS,USERS } = require('../index'); // Assuming your Express app is defined in app.js
const faker = require('faker');
chai.use(chaiHttp);

// Reusable login function
const loginUser = async () => {
  authenticatedUser = USERS.find(user=>user.email==='user@example.com')
  email = authenticatedUser.email
  password = authenticatedUser.password
  // Perform login request
  const res = await chai.request(app)
    .post('/login')
    .send({ email, password });

  // Return the token or other necessary information for authentication in subsequent requests
  return res.body.token; // Modify this based on your actual login response structure
};

describe('POST /:id/submissions', () => {
  let authToken; // Variable to store authentication token

  // Perform login before running the test suite
  before(async () => {
    authToken = await loginUser();
  });


  it('should submit a solution for a question and return success message', (done) => {
    
    const id = faker.random.number({ min: 1, max: 100 });
    const title = faker.lorem.text();
    QUESTIONS.push({id,title}) 
    const url = `/${id}/submissions`;
    const solution = faker.lorem.text();
    chai.request(app)
      .post(url) 
      .set('Authorization', `Bearer ${authToken}`)
      .send({ solution })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.text).to.equal('Solution submitted successfully.');
        done();
      });
  });

  it('should return an error if solution is not provided', (done) => {
    
    const id = faker.random.number({ min: 1, max: 100 });
    const title = faker.lorem.text();
    QUESTIONS.push({id,title}) 
    const url = `/${id}/submissions`;
    chai.request(app)
      .post(url) 
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Solution is required');
        done();
      });
  });

});

describe('GET /:id/submissions', () => {
  let authToken; // Variable to store authentication token

  // Perform login before running the test suite
  before(async () => {
    authToken = await loginUser();
  });
  
  it('should return submissions for a valid question ID', (done) => {
    const id = faker.random.number({ min: 1, max: 100 });
    const title = faker.lorem.text();
    QUESTIONS.push({id,title}) 
    const url = `/${id}/submissions`;
    authenticatedUser = USERS.find(user=>user.email==='user@example.com')
    email = authenticatedUser.email
    // Mock a submission for the valid question ID
    const submission = { email, 'question_id':`${id}`, solution: 'Test solution' };
    SUBMISSIONS.push(submission);

    chai.request(app)
      .get(url)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        const responseBodyJson = JSON.parse(res.text);
        console.log(res.text)
        const submissions = Array.isArray(responseBodyJson) ? responseBodyJson : [responseBodyJson];
        for (const submission of submissions) {
          expect(submission.email).to.deep.equal(email)
        }
        done();
      });
  });
  it('should return no submissions when there are no user submissions', (done) => {
    const id = faker.random.number({ min: 1, max: 100 });
    const title = faker.lorem.text();
    QUESTIONS.push({id,title}) 
    const url = `/${id}/submissions`;
    authenticatedUser = USERS.find(user=>user.email==='user@example.com')
    email = authenticatedUser.email
    chai.request(app)
      .get(url)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'No submissions for this question');
        done();
      });
  });
})

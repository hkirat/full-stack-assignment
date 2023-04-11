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
    //user = USERS.find(user=>user.email==='user@example.com')
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
        // Assert that the submission is stored in SUBMISSIONS array
        // expect(SUBMISSIONS.length).to.equal(1);
        // expect(SUBMISSIONS[0]).to.have.property('user_id');
        // expect(SUBMISSIONS[0]).to.have.property('question_id');
        // expect(SUBMISSIONS[0]).to.have.property('solution', 'Solution for question 1');
        // expect(SUBMISSIONS[0]).to.have.property('status', 'Approved');
        done();
      });
  });

  it('should return an error if solution is not provided', (done) => {
    //user = USERS.find(user=>user.email==='user@example.com')
    const id = faker.random.number({ min: 1, max: 100 });
    const title = faker.lorem.text();
    QUESTIONS.push({id,title}) 
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

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, QUESTIONS } = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

// Mock authenticated user
const authenticatedUser = {
  // Replace with properties of authenticated user required for authentication
  // e.g., token, userId, etc.
};

describe('GET /questions', () => {
    it('should return questions when user is authenticated', (done) => {
      // Call login endpoint to get token
      chai.request(app)
        .post('/login')
        .send({ email: 'user@example.com', password: 'userpassword' }) // Replace with appropriate email and password for your test user
        .end((err, res) => {
          // Assert response status code
          expect(res.status).to.equal(200);
  
          // Extract token from response body
          const token = res.body.token;
          console.log("token extracted from response : "+token)
          // Set up authenticated user object in the request object
          const user = authenticatedUser;
          user.token = token;
  
          // Use chai-http to make an authenticated GET request to /questions
          chai.request(app)
            .get('/questions')
            .set('Authorization', `Bearer ${token}`) // Set authorization header with token
            .end((err, res) => {
              // Assert response status code
              expect(res.status).to.equal(200);
  
              // Assert response body
              expect(res.body).to.deep.equal(QUESTIONS); // Compare with expected QUESTIONS data
              done();
            });
        });
    });
  
    it('should return forbidden when user is not authenticated', (done) => {
      // Use chai-http to make an unauthenticated GET request to /questions
      chai.request(app)
        .get('/questions')
        .end((err, res) => {
          // Assert response status code
          expect(res.status).to.equal(403);
  
          // Assert response body
          expect(res.body).to.deep.equal({ message: 'Forbidden' }); // Compare with expected error message
          done();
        });
    });
  });
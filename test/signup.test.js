const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {app,USERS} = require('../index'); // Assuming your Express app is defined in app.js


chai.use(chaiHttp);

describe('POST /signup', () => {
  it('should create a new user and return success message', (done) => {
    USERS.splice(0, USERS.length)
    chai.request(app)
      .post('/signup')
      .send({ email: 'test@example.com', password: 'test123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'User signed up successfully');
        done();
      });
  });

  it('should return an error if user already exists with the given email', (done) => {
    // Add a dummy user to USERS array to simulate an existing user
    USERS.push({ email: 'test@example.com', password: 'test123' });

    chai.request(app)
      .post('/signup')
      .send({ email: 'test@example.com', password: 'test123' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'User with this email already exists');
        done();
      });
  });

  // Add more test cases for different scenarios, such as missing email or password, invalid email, etc.
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { app, USERS } = require('../index');

chai.use(chaiHttp);

describe('POST /login', () => {
  beforeEach(() => {
    // Reset USERS array before each test
    USERS.length = 0;
  });

  it('should return a token for successful login with correct email and password', (done) => {
    // Add a dummy user to USERS array to simulate an existing user
    const user = { email: 'test@example.com', password: 'password' };
    USERS.push(user);
    chai.request(app)
      .post('/login')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should return 401 status code for incorrect password', (done) => {
    // Add a dummy user to USERS array to simulate an existing user
    const user = { email: 'test@example.com', password: 'password' };
    USERS.push(user);
    chai.request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrong_password' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message').that.equals('Invalid password');
        done();
      });
  });

  it('should return 401 status code for invalid email', (done) => {
    const user = { email: 'test@example.com', password: 'password' };
    USERS.push(user);
    chai.request(app)
      .post('/login')
      .send({ email: 'invalid_email', password: 'password' })
      .end((err, res) => {
        console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message').that.equals('Invalid email');
        done();
      });
  });

  it('should return 401 status code for non-existing user', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'non_existing@example.com', password: 'password' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message').that.equals('Invalid email');
        done();
      });
  });

  it('should return 401 status code for missing email or password', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'test@example.com' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message').that.equals('Email and password are required');
        done();
      });
  });

  // it('should return 401 status code for empty request body', (done) => {
  //   chai.request(app)
  //     .post('/login')
  //     .send({})
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(401);
  //       expect(res.body).to.equal('Missing email or password');
  //       done();
  //     });
  // });
});

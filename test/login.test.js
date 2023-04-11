const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { app, USERS } = require('../index');
const faker = require('faker');

chai.use(chaiHttp);

describe('POST /login', () => {
  it('should return a token for successful login with correct email and password', (done) => {
    // Add a dummy user to USERS array to simulate an existing user
    const email = faker.internet.email(); 
    const password = 'test123';
    const role = 'user'
    const user = { email,password,role };
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
    const email = faker.internet.email(); 
    const password = 'test123';
    const role = 'user'
    const user = { email,password,role };
    USERS.push(user);
    chai.request(app)
      .post('/login')
      .send({ email,password:'wrongpassword',role })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message').that.equals('Invalid password');
        done();
      });
  });

  it('should return 401 status code for invalid email', (done) => {
    const email = faker.internet.email(); 
    const password = 'test123';
    const role = 'user'
    const user = { email,password,role };
    USERS.push(user);
    chai.request(app)
      .post('/login')
      .send({ email: 'invalid_email', password, role})
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

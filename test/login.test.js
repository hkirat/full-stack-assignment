const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {app,USERS} = require('../index'); // Assuming your Express app is defined in app.js
chai.use(chaiHttp);

describe('POST /login', () => {
    it('should return a token for successful login with correct email and password', (done) => {
        // Add a dummy user to USERS array to simulate an existing user
        USERS.push({ email: 'test@example.com', password: 'test123' });
        chai.request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'test123' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
    
    it('should return 401 status code for incorrect password', (done) => {
        // Add a dummy user to USERS array to simulate an existing user
        USERS.push({ email: 'test@example.com', password: 'test123' });
        chai.request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'test1234' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          console.log(res.body)
          expect(res.body).to.have.property('message', 'Invalid password');
          done();
        });
    });
    
    
  });
  
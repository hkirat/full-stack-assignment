const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, QUESTIONS, USERS } = require('../index');
const faker = require('faker');
chai.use(chaiHttp);
const expect = chai.expect;


describe('GET /questions', () => {
    it('should return questions when user is authenticated', (done) => {
      authenticatedUser = USERS.find(user=>user.email==='user@example.com')
      const email = authenticatedUser.email
      const password = authenticatedUser.password
      const role = authenticatedUser.role
      // Call login endpoint to get token
      chai.request(app)
        .post('/login')
        .send({ email,password,role }) // Replace with appropriate email and password for your test user
        .end((err, res) => {
          // Assert response status code
          expect(res.status).to.equal(200);
  
          // Extract token from response body
          const token = res.body.token;
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
    it('should return unauthorized when user token is invalid', (done) => {
      authenticatedUser = USERS.find(user=>user.email==='user@example.com')
      const email = authenticatedUser.email
      const password = authenticatedUser.password
      const role = authenticatedUser.role
      chai.request(app)
        .post('/login')
        .send({ email,password,role}) // Replace with appropriate email and password for your test user
        .end((err, res) => {
          // Assert response status code
          expect(res.status).to.equal(200);
  
          // Extract token from response body and add bad data
          const token = res.body.token+"someerror";
          // Set up authenticated user object in the request object
          const user = authenticatedUser;
          user.token = token
  
          // Use chai-http to make an authenticated GET request to /questions
          chai.request(app)
            .get('/questions')
            .set('Authorization', `Bearer ${token}`) // Set authorization header with token
            .end((err, res) => {
              // Assert response status code
              expect(res.status).to.equal(401);
  
            // Assert response body
            expect(res.body).to.deep.equal({ message: 'Unauthorized' }); // Compare with expected error message
            done();
            });
        });
    });
  });
  describe('POST /questions', () => {
    it('should allow admin user to post a question', (done) => {
      authenticatedUser = USERS.find(user=>user.email==='admin@example.com')
      const email = authenticatedUser.email
      const password = authenticatedUser.password
      const role = authenticatedUser.role
      // Call login endpoint to get token
      chai.request(app)
        .post('/login')
        .send({ email,password,role }) // Replace with appropriate email and password for your test user
        .end((err, res) => {
          // Assert response status code
          expect(res.status).to.equal(200);
  
          // Extract token from response body
          const token = res.body.token;
          // Set up authenticated user object in the request object
          const user = authenticatedUser;
          user.token = token;

          id = faker.id
          title = faker.title
  
          // Use chai-http to make an authenticated GET request to /questions
          chai.request(app)
            .post('/questions')
            .set('Authorization', `Bearer ${token}`) // Set authorization header with token
            .send({id,title})
            .end((err, res) => {
              // Assert response status code
              expect(res.status).to.equal(201);

              // Assert response body                                         
              expect(res.body).to.have.property('message','Question added successfully')// Compare with expected QUESTIONS data
              done();
            });
        });
        
    });
    it('should not allow non admin user to post a question', (done) => {
      authenticatedUser = USERS.find(user=>user.email==='user@example.com')
      const email = authenticatedUser.email
      const password = authenticatedUser.password
      const role = authenticatedUser.role
      // Call login endpoint to get token
      chai.request(app)
        .post('/login')
        .send({ email,password,role }) // Replace with appropriate email and password for your test user
        .end((err, res) => {
          // Assert response status code
          expect(res.status).to.equal(200);
  
          // Extract token from response body
          const token = res.body.token;
          // Set up authenticated user object in the request object
          const user = authenticatedUser;
          user.token = token;

          id = faker.id
          title = faker.title
  
          // Use chai-http to make an authenticated GET request to /questions
          chai.request(app)
            .post('/questions')
            .set('Authorization', `Bearer ${token}`) // Set authorization header with token
            .send({id,title})
            .end((err, res) => {
              // Assert response status code
              expect(res.status).to.equal(403);

              // Assert response body                                         
              expect(res.body).to.have.property('message','Forbidden')// Compare with expected QUESTIONS data
              done();
            });
        });
        
    });
  })
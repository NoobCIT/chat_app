var expect = require('chai').expect;
var should = require('chai').should();
var app = require('../app');
var request = require('supertest');

// Try simple tests to see if it works
describe("Page Navigation", function() {
  it('should navigate to login page', function(done) {
    request(app)
      .get('/login')
      .end(function(err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });

  it('should navigate to signup page', function(done) {
    request(app)
      .get('/signup')
      .end(function(err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});

describe('User Sign Up', function() {
  it('should sign the user up if credentials are valid', function(done) {
    request(app)
      .post('/save')
      .send({ firstname: 'Test',
              lastname:  'User',
              email: 'tester@yahoo.com',
              password: 'testme',
              passwordConfirmation: 'testme' })
      .end(function(err, res) {
        expect('Location', '/profile');
        done();
      });
  });
});

//Example user to pass to login
const userCredentials = {
  email: 'batman@yahoo.com',
  password: 'martha'
}

//Log the user in before running any tests
//When a user logs in, he/she is already at the profile page
var authenticatedUser = request.agent(app);

before(function(done) {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      expect('Location', '/profile');
      done();
    });
});

describe('GET /profile', function(done) {
  it('should return to home page if user navigates from profile page to home', function(done) {
    authenticatedUser
      .get('/')
      .expect(200, done);
  });

  it('should return a an unsuccessful response and redirect to /home', function(done) {
    request(app)
      .get('/profile')
      .expect(302)
      .expect('Location', '/')
      done();
  });
});

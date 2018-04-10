var express = require('express');
var router = express.Router();
var staticPages = require("../controllers/StaticPagesController");
var users = require("../controllers/UsersController");

// GET route for home page
router.get('/', function(req, res) {
  staticPages.home(req, res);
});

// GET route for signup page
router.get('/signup', function(req, res) {
  users.signup(req, res);
})

// Get route for login page
router.get('/login', function(req, res) {
  users.login(req, res);
})

// POST Sign Up for New User
router.post('/save', function(req, res) {
  users.save(req, res);
})

// Get route for profile of user
router.get('/profile', function(req, res) {
  users.profile(req, res);
})

// Authentication for user login
router.post('/login', function(req, res) {
  users.authenticate(req, res);
})

// Get route for logout
router.get('/logout', function(req, res) {
  users.logout(req, res);
})

module.exports = router;

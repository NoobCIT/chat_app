var mongoose = require('mongoose');
var User = require('../models/User');
var usersController = {};

// Sign up page
usersController.signup = function(req, res) {
  res.render("../views/Users/signup");
};

// Login page
usersController.login = function(req, res) {
  res.render("../views/Users/login");
}

// Sign Up New User
usersController.save = function(req, res, next) {
  if (req.body.firstname &&
    req.body.lastname &&
    req.body.email &&
    req.body.password === req.body.passwordConfirmation) {

      var userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      }

      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect("/profile");
        }
      });

    } else {
      req.flash('signup', 'Fill all fields & check matching passwords!');
      res.locals.messages = req.flash();
      res.render('../views/Users/signup');
      //var err = new Error('All fields are required.');
      //err.status = 400;
      //return next(err);
    }
}

//Get User Profile
usersController.profile = function(req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('User was not found.');
          err.status = 400;
          return next(err);
        } else {
          return res.render("../views/Users/profile", {user: user});
        }
      }
    });
}

// Authentication for user login
usersController.authenticate = function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        req.flash('login', 'Password or email is incorrect!');
        res.locals.messages = req.flash();
        res.render('../views/Users/login');
        //var err = new Error("Password or email is incorrect.");
        //err.status = 401;
        //return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    req.flash('emptyLogin', 'All fields are required!');
    res.locals.messages = req.flash();
    res.render('../views/Users/login');
    //var err = new Error("All fields are required.");
    //err.status = 400;
    //return next(err);
  }
}

// Logging out
usersController.logout = function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};

module.exports = usersController;

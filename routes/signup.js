var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET signup page. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

/* POST signup page. */
router.post('/', function(req, res, next) {
  if (req.body.password !== req.body.passwordConfirmation) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("Passwords bad");
    return next(err);
  }

  if (req.body.firstname &&
    req.body.lastname &&
    req.body.email &&
    req.body.password &&
    req.body.passwordConfirmation) {

      var userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
      }

      User.create(userData, function(err, user) {
        if (err) {
          return next(err)
        } else {
          return res.redirect('/profile');
        }
      });
  }
});



module.exports = router;

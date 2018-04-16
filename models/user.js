var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  msglogs: [{
    person: String,
    logs: String,
    _id: false
  }]
});

// Authenticate login info with that stored in database
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        var err = new Error('User was not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

// Hash password before saving to the database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

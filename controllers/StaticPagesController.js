var mongoose = require('mongoose');
var staticPagesController = {};

// Home Page
staticPagesController.home = function(req, res) {
  res.render("../views/StaticPages/home", {session: req.session.userId});
};

module.exports = staticPagesController;

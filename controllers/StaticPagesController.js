var mongoose = require('mongoose');
var staticPagesController = {};

// Home Page
staticPagesController.home = function(req, res) {
  res.render("../views/StaticPages/home");
};

module.exports = staticPagesController;

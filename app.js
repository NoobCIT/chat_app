var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
require('./models/User');
var session = require('express-session');

var app = express();
var server = app.listen(4000);
var client = require("socket.io")(server);

// emit = server send to client
// broadcase = send to everyone except for the socket that started it.

// view engine setup using handle bars
app.engine('hbs', exphbs({extname: '.hbs', defaultLayout: 'layout'}));
app.set('view engine', 'hbs');

var dbConnectionString = process.env.MONGOLAB_URI || 'mongodb://localhost';
mongoose.connect(dbConnectionString + '/chat_app', function(err, db) {
  if (err) {
    throw err;
  } else {
    console.log("The Mongo Has Been Connected!");

    //Make connection to Socket.io
    client.on("connection", function(socket) {
      let chat = db.collection("chats");

      //Create function to send status from client to server
      sendStatus = function(status) {
        socket.emit("status", status) //name status to status
      }

      // Get chats from the mongodb collection
      chat.find().limit(100).sort({ _id:1 }).toArray(function(err, res) {
          if (err) {
            throw err;
          }

          // Emit the messages as "output"
          socket.emit("output", res);
      });

      // Handle input events
      socket.on("input", function(data) {
        let name  = data.name;
        let message = data.message;

        // Check for name and message
        if (name == "" || message == "") {
          // Send error status
          sendStatus("Please enter a name and message");
        } else {
          // Insert message into database since its valid
          chat.insert({ name: name, message: message }, function() {
            client.emit("output", [data]); //emit output back to client

            // Send status object
            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });
      socket.on("clear", function() {
        // Remove all chats from collection
        chat.remove({}, function() { //{} means select everything
          // Emit cleared
          socket.emit("cleared");
        })
      })
    })
  }
});
if (app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: ["public/**/*.{js,css}", "client/*.js", "sass/**/*.scss", "views/**/*.hbs"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 3000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}

//Use sessions
app.use(session({
  secret: 'something',
  resave: true,
}));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

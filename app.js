var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var User = require('./models/user');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var app = express();
var server = app.listen(process.env.PORT || 4000);
var client = require("socket.io")(server); //run socketio on port 4000

// emit = server send to client or viceversa
// broadcase = send to everyone except for the socket that started it.
//mongodb://ds243059.mlab.com:43059/heroku_chat_app
// view engine setup using handle bars
app.engine('hbs', exphbs({extname: '.hbs', defaultLayout: 'layout'}));
app.set('view engine', 'hbs');
//chat_app is db name
var dbConnectionString = (process.env.MONGOLAB_URI || 'mongodb://localhost/chat_app');
mongoose.connect(dbConnectionString, function(err, db) {
  if (err) {
    throw err;
  } else {
    console.log("The Mongo Has Been Connected!");

    //Make connection to Socket.io
    client.on("connection", function(socket) {
      let chat = db.collection("chats"); //Make a collection/table called chats
      let registeredUsers = db.collection("users");

      //Create function to send status from server to client
      sendStatus = function(status) {
        socket.emit("status", status) //name status to status
      }

      //Get list of registered users from server
      registeredUsers.find().sort({ firstname: 1 }).toArray(function(err, res) {
        if (err) {
          throw err;
        }

        socket.emit("listOfUsers", res);
      });

      // Get chats from the mongodb collection
      //chat.find().limit(100).sort({ _id:1 }).toArray(function(err, res) {
      //    if (err) {
      //      throw err;
      //    }

          // Emit the messages(res) as "output" from server to client (html file)
      //    socket.emit("output", res);
      //});

        socket.on("singleChatLog", function(data) {
        let sender = data.sender;
        let receiver = data.receiver;

        if (chat.find({ relationship: { $all: [sender, receiver] } }).toArray().length == 0) {
          chat.insert({ name: "", message: "", relationship: [sender, receiver] });
        }


        // Get chats from the mongodb collection
        chat.find({ relationship: { $all: [sender, receiver] } }).limit(100).sort({ _id:1 }).toArray(function(err, res) {
            if (err) {
              throw err;
            }
            // Emit the messages(res) as "output" from server to client (html file)
            socket.emit("output", res);
        });
      })

      // Handle input events from the client sending messages
      //socket.on = you are catching what the client is sending to you
      socket.on("input", function(data) {
        let name  = data.name;
        let message = data.message;
        let sender = data.sender;
        let receiver = data.receiver;

        // Check for name and message
        if (message == "") {
          // Send error status
          sendStatus("Please enter a message");
        } else {
          chat.insert({ name: name, message: message, relationship: [sender, receiver] }, function() {
            client.emit("output", [data]); //emit output back to client

             //Send status object
            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });
      //Feature to clear chat messages (from client we are gonna initiate a 'clear')
      socket.on("clear", function() {
        // Remove all chats from collection
        chat.remove({}, function() { //{} means select everything
          // Emit cleared
          socket.emit("cleared"); //send cleared to client from server
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
  saveUninitialized: false, // don't create session until something stored
  store: new MongoStore({ mongooseConnection: mongoose.connection })
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

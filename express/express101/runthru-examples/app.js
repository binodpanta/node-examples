
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , songs = require('./routes/songs') // add a route
  , http = require('http')
  , path = require('path');

var app = express();

// Just a quick trial of printing out cookies
var cookielogger = function(req,res,next){
    if (req.cookies) 
        console.log('Cookies were sent:' + JSON.stringify(req.cookies));
    next();
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(path.join(__dirname, "public", "images", "favicon.ico")));
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(cookielogger);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // to get a directory listing? This must come after the router middleware
  app.use(express.directory(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// try adding my own middleware that does error handling
// Adding this after the standard express errorHandler
app.use(function(err,req,res,next) {
      if(err)
          res.send('An error occurred with Error code: ' + err.code + ', : message: ' + err.message);
  });

app.get('/', routes.index);
app.get('/users', user.list);


// Try a custom route
// NOTE: HAD TO RESTART THE APP BEFORE THIS TOOK EFFECT!
//app.get('/highwaytohell',function(req,res) {
//  res.send("Living easy, living free ... want more?");
//})
app.get('/songs/:title', songs.lyrics);
app.get('/songs', songs.list);

// form handling via post
app.post('/', songs.search);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

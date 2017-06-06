import express = require('express');
import { readdir } from 'fs';
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

let index = require('./routes/index');
let laserGame = require('./routes/lasergame');
let login = require('./routes/login');
let user = require('./routes/user');
let register = require('./routes/register');
let logout = require('./routes/logout');
let protectedRoute = require('./routes/protected');
let usersRoute = require('./routes/users');
let notesRoute = require('./routes/notes');
let apiLasergameRoute = require('./routes/api_lasergame');

let app = express();

let passport = require('./passport');
let secretkey = require('./secret').secretkey;

let notesList: string[] = [];
readdir('./notes', function (err, files) {
  if (err) {
    console.log(err);
    return;
  }
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    notesList.push(file.slice(0, file.indexOf('.')));
  }
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(secretkey));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({secret: secretkey, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req: any, res: any, next: any) {
    if (req.user) {
        res.locals.user = req.user;
    }
    res.locals.notesList = notesList;
    next();
});

app.use('/', index);
app.use('/lasergame', laserGame);
app.use('/login', login);
app.use('/user', user);
app.use('/register', register);
app.use('/logout', logout);
app.use('/protected', protectedRoute);
app.use('/siteUsers', usersRoute);
app.use('/notes', notesRoute);
app.use('/api/lasergame', apiLasergameRoute);

class ErrorWithStatus extends Error {
  status?: number;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new ErrorWithStatus('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err: ErrorWithStatus, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

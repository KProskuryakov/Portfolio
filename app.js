let express = require('express');
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

let app = express();

let passport = require('./passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("Incredible!"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: "Incredible!"}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
});

app.use('/', index);
app.use('/lasergame', laserGame);
app.use('/login', login);
app.use('/user', user);
app.use('/register', register);
app.use('/logout', logout);
app.use('/protected', protectedRoute);
app.use('/users', usersRoute);
app.use('/notes', notesRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

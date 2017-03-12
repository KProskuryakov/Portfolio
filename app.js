let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let bcrypt = require('bcrypt-nodejs');
let session = require('express-session');

let index = require('./routes/index');
let laserGame = require('./routes/lasergame');
let login = require('./routes/login');
let user = require('./routes/user');
let register = require('./routes/register');
let logout = require('./routes/logout');

const monk = require('monk');
const db = monk("localhost:27017/myproject");

let app = express();

app.use(function(req,res,next){
    req.db = db;
    next();
});

let passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        let collection = db.get('usercollection');
        collection.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, function(err, res) {
                if (!res) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    let collection = db.get('usercollection');
    collection.findOne({_id: id}, '-password', function(err, user) {
        done(err, user);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

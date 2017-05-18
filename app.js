"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var laserGame = require('./routes/lasergame');
var login = require('./routes/login');
var user = require('./routes/user');
var register = require('./routes/register');
var logout = require('./routes/logout');
var protectedRoute = require('./routes/protected');
var usersRoute = require('./routes/users');
var notesRoute = require('./routes/notes');
var apiLasergameRoute = require('./routes/api_lasergame');
var app = express();
var passport = require('./passport');
var secretkey = require('./secret').secretkey;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(secretkey));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: secretkey, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
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
app.use('/siteUsers', usersRoute);
app.use('/notes', notesRoute);
app.use('/api/lasergame', apiLasergameRoute);
var ErrorWithStatus = (function (_super) {
    __extends(ErrorWithStatus, _super);
    function ErrorWithStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ErrorWithStatus;
}(Error));
app.use(function (req, res, next) {
    var err = new ErrorWithStatus('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;

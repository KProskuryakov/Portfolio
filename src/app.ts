import express = require('express')
import { readdir } from 'fs'
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')

const routes = {
  index: require('./routes/index'),
  lasergame: require('./routes/lasergame'),
  login: require('./routes/login'),
  user: require('./routes/user'),
  register: require('./routes/register'),
  logout: require('./routes/logout'),
  protected: require('./routes/protected'),
  users: require('./routes/users'),
  notes: require('./routes/notes'),
  api: {
    index: require('./routes/api/index'),
    lasergame: require('./routes/api/lasergame')
  }
}

let app = express()

import { Passport } from 'passport'

let passport: Passport = require('./passport')
let secretkey = process.env.SECRET_KEY

let notesList: string[] = []
readdir('./notes', function (err, files) {
  if (err) {
    console.log(err)
    return
  }
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    notesList.push(file.slice(0, file.indexOf('.')))
  }
})

// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(secretkey))
app.use(express.static(path.join(__dirname, '../public')))
app.use(session({secret: secretkey, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req: any, res: any, next: any) {
    if (req.user) {
        res.locals.user = req.user
    }
    res.locals.notesList = notesList
    next()
})

app.use('/', routes.index)
app.use('/lasergame', routes.lasergame)
app.use('/login', routes.login)
app.use('/user', routes.user)
app.use('/register', routes.register)
app.use('/logout', routes.logout)
app.use('/protected', routes.protected)
app.use('/siteUsers', routes.users)
app.use('/notes', routes.notes)
app.use('/api/', routes.api.index)
app.use('/api/lasergame', routes.api.lasergame)

class ErrorWithStatus extends Error {
  status?: number
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new ErrorWithStatus('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err: ErrorWithStatus, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

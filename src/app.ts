import express = require("express");
import { readdir } from "fs";
import path = require("path");
import favicon = require("serve-favicon");
import winston = require("winston");
import cookieParser = require("cookie-parser");
import bodyParser = require("body-parser");
import session = require("express-session");

const routes = {
  api: {
    index: require("./routes/api/index"),
    lasergame: require("./routes/api/lasergame"),
    webdata: require("./routes/api/webdata"),
  },
  index: require("./routes/index"),
  lasergame: require("./routes/lasergame"),
  login: require("./routes/login"),
  logout: require("./routes/logout"),
  notes: require("./routes/notes"),
  protected: require("./routes/protected"),
  register: require("./routes/register"),
  user: require("./routes/user"),
  users: require("./routes/users"),
  webdata: require("./routes/webdata"),
};

const app = express();

import { Passport } from "passport";

import passport = require("./passport");
const secretkey = process.env.SECRET_KEY;

const notesList: string[] = [];
readdir("./notes", (err, files) => {
  if (err) {
    throw err;
  }
  for (const file of files) {
    notesList.push(file.slice(0, file.indexOf(".")));
  }
});

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(secretkey));
app.use(express.static(path.join(__dirname, "../public")));
app.use(session({secret: secretkey, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req: any, res: any, next: any) => {
    if (req.user) {
        res.locals.user = req.user;
    }
    res.locals.notesList = notesList;
    next();
});

app.use("/", routes.index);
app.use("/lasergame", routes.lasergame);
app.use("/login", routes.login);
app.use("/user", routes.user);
app.use("/register", routes.register);
app.use("/logout", routes.logout);
app.use("/protected", routes.protected);
app.use("/siteUsers", routes.users);
app.use("/notes", routes.notes);
app.use("/webdata", routes.webdata);

app.use("/api/", routes.api.index);
app.use("/api/lasergame", routes.api.lasergame);
app.use("/api/webdata", routes.api.webdata);

class ErrorWithStatus extends Error {
  public status?: number;
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new ErrorWithStatus("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err: ErrorWithStatus, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

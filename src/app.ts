import express = require("express");
import { readdir } from "fs";
import path = require("path");
import favicon = require("serve-favicon");
import morgan = require("morgan");
import winston = require("winston");
import cookieParser = require("cookie-parser");
import bodyParser = require("body-parser");
import session = require("express-session");
import connectPG = require("connect-pg-simple");
import { Passport } from "passport";
import passport = require("./passport");
import pool from "./db/postgresdb";

import apiIndex from "./routes/api/index";
import apiLasergame from "./routes/api/lasergame";
import apiWebdata from "./routes/api/webdata";
import index from "./routes/index";
import lasergame from "./routes/lasergame";
import login from "./routes/login";
import logout from "./routes/logout";
import notes from "./routes/notes";
import protect from "./routes/protected";
import register from "./routes/register";
import user from "./routes/user";
import users from "./routes/users";
import webdata from "./routes/webdata";

const app = express();
const secretkey = process.env.SECRET_KEY;
const pgSession = connectPG(session);

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

app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(secretkey));
app.use(express.static(path.join(__dirname, "../public")));
app.use(session({
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: false,
  secret: secretkey,
  store: new pgSession({
    pool,
  }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  res.locals.notesList = notesList;
  next();
});

app.use("/", index);
app.use("/lasergame", lasergame);
app.use("/login", login);
app.use("/user", user);
app.use("/register", register);
app.use("/logout", logout);
app.use("/protected", protect);
app.use("/siteUsers", users);
app.use("/notes", notes);
app.use("/webdata", webdata);

app.use("/api/", apiIndex);
app.use("/api/lasergame", apiLasergame);
app.use("/api/webdata", apiWebdata);

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

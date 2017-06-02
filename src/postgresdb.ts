// This file is for the express purpose of converting the existing mongodb system to postgresql
let pg = require('pg');
let config = require('./secret').pgconfig;

let pool = new pg.Pool(config);

import { SiteUser, LasergameLevel, LasergameDailyLevel } from './dbmodels';


process.on('unhandledRejection', function (e: Error) {
  console.log(e.message, e.stack)
});

pool.query("CREATE TABLE IF NOT EXISTS site_users (email varchar(256) PRIMARY KEY, password varchar(80) NOT NULL, display_name varchar(64) UNIQUE NOT NULL);");
pool.query("CREATE TABLE IF NOT EXISTS lasergame_levels (id serial PRIMARY KEY, name varchar(64) NOT NULL, level_data jsonb NOT NULL, upload_timestamp timestamptz DEFAULT current_timestamp, times_beaten int DEFAULT 0, user_display_name varchar(64) references site_users (display_name));")
pool.query("CREATE TABLE IF NOT EXISTS lasergame_daily_levels (daily_date date PRIMARY KEY DEFAULT CURRENT_DATE, level jsonb NOT NULL);");

let siteUsers = {
  insert: function (email: string, displayName: string, pass: string, callback: (err: Error, user: SiteUser) => void) {
    pool.query("INSERT INTO site_users (email, password, display_name) VALUES ($1, $2, $3) RETURNING *", [email, pass, displayName], (err: Error, res: any) => {
      if (res) return callback(err, <SiteUser>res.rows[0]);
      return callback(err, null);
    });
  },

  getPasswordByEmail: function (email: string, callback: (err: Error, password: string) => void) {
    pool.query('SELECT * FROM site_users WHERE email = $1', [email], (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0].password);
      return callback(err, null);
    });
  },

  getUserByEmail: function (email: string, callback: (err: Error, user: SiteUser) => void) {
    pool.query('SELECT * FROM site_users WHERE email = $1', [email], (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0]);
      return callback(err, null);
    });
  },

  getUserByDisplayName: function (displayName: string, callback: (err: Error, user: SiteUser) => void) {
    pool.query('SELECT * FROM site_users WHERE display_name = $1', [displayName], (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0]);
      return callback(err, null);
    });
  },

  getAll: function (callback: (err: Error, allUsers: SiteUser[]) => void) {
    pool.query('SELECT * FROM site_users', (err: Error, res: any) => {
      if (res) return callback(err, res.rows);
      return callback(err, null);
    });
  }
};

let lasergameLevels = {
  getAllLevelsOfPlayer: function (playerName: string, callback: (err: Error, levels: LasergameLevel[]) => void) {
    pool.query('SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC', [playerName], (err: Error, res: any) => {
      if (res) return callback(err, res.rows);
      return callback(err, null);
    });
  },

  getLevelByID: function (id: number, callback: (err: Error, level: LasergameLevel) => void) {
    pool.query('SELECT * FROM lasergame_levels WHERE id = $1', [id], (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0]);
      return callback(err, null);
    });
  },

  insert: function (levelData: any, name: string, userDisplayName: string, callback: (err: Error, id: number) => void) {
    console.log('Attempting to insert lasergame level of: ' + userDisplayName);
    pool.query('INSERT INTO lasergame_levels (level_data, name, user_display_name) VALUES ($1, $2, $3) RETURNING id', [JSON.stringify(levelData), name, userDisplayName], (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0].id);
      return callback(err, null);
    });
  }
};

let lasergameDailyLevels = {
  getTodaysDailyLevel: function(callback: (err: Error, level: LasergameDailyLevel) => void) {
    pool.query('SELECT * FROM lasergame_daily_levels WHERE date = CURRENT_DATE', (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0]);
      return callback(err, null);
    });
  },

  getDailyLevel: function(date: string, callback: (err: Error, level: LasergameDailyLevel) => void) {
    pool.query('SELECT * FROM lasergame_daily_levels WHERE date = $1', [date], (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0]);
      return callback(err, null);
    });
  },

  insertDailyLevel: function(levelData: object, callback: (err: Error, date: string) => void) {
    pool.query('INSERT INTO lasergame_daily_levels (level_data) VALUES ($1) RETURNING daily_date', [JSON.stringify(levelData)], (err: Error, res: any) => {
      if (res) return callback(err, res.rows[0].daily_date);
      return callback(err, null);
    });
  },

  getAllDailyLevels: function(callback: (err: Error, levels: LasergameDailyLevel[]) => void) {
    pool.query('SELECT * FROM lasergame_daily_levels', (err: Error, res: any) => {
      if (res) return callback(err, res.rows);
      return callback(err, null);
    });
  }
};

export { siteUsers, lasergameLevels, lasergameDailyLevels };
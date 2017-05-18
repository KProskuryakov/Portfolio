"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg = require('pg');
var config = require('./secret').pgconfig;
var pool = new pg.Pool(config);
process.on('unhandledRejection', function (e) {
    console.log(e.message, e.stack);
});
pool.query("CREATE TABLE IF NOT EXISTS site_users (email varchar(256) PRIMARY KEY, password varchar(80) NOT NULL, display_name varchar(64) UNIQUE NOT NULL);");
pool.query("CREATE TABLE IF NOT EXISTS lasergame_levels (id serial PRIMARY KEY, name varchar(64) NOT NULL, level_data jsonb NOT NULL, upload_timestamp timestamptz DEFAULT current_timestamp, times_beaten int DEFAULT 0, user_display_name varchar(64) references site_users (display_name));");
var siteUsers = {
    insert: function (email, displayName, pass, callback) {
        pool.query("INSERT INTO site_users (email, password, display_name) VALUES ($1, $2, $3) RETURNING *", [email, pass, displayName], function onInsertComplete(err, res) {
            if (res)
                return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },
    getPasswordByEmail: function (email, callback) {
        pool.query('SELECT * FROM site_users WHERE email = $1', [email], function onPasswordGet(err, res) {
            if (res)
                return callback(err, res.rows[0].password);
            return callback(err, null);
        });
    },
    getUserByEmail: function (email, callback) {
        pool.query('SELECT * FROM site_users WHERE email = $1', [email], function onUserGet(err, res) {
            if (res)
                return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },
    getUserByDisplayName: function (displayName, callback) {
        pool.query('SELECT * FROM site_users WHERE display_name = $1', [displayName], function onUserGet(err, res) {
            if (res)
                return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },
    getAll: function (callback) {
        pool.query('SELECT * FROM site_users', function onGetAll(err, res) {
            if (res)
                return callback(err, res.rows);
            return callback(err, null);
        });
    }
};
exports.siteUsers = siteUsers;
var lasergameLevels = {
    getAllLevelsOfPlayer: function (playerName, callback) {
        pool.query('SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC', [playerName], function onLevelGet(err, res) {
            if (res)
                return callback(err, res.rows);
            return callback(err, null);
        });
    },
    getLevelByID: function (id, callback) {
        pool.query('SELECT * FROM lasergame_levels WHERE id = $1', [id], function onLevelGet(err, res) {
            if (res)
                return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },
    insert: function (levelData, name, userDisplayName, callback) {
        console.log('Attempting to insert lasergame level of: ' + userDisplayName);
        pool.query('INSERT INTO lasergame_levels (level_data, name, user_display_name) VALUES ($1, $2, $3) RETURNING id', [JSON.stringify(levelData), name, userDisplayName], function onLevelInsert(err, res) {
            if (res)
                return callback(err, res.rows[0].id);
            return callback(err, null);
        });
    }
};
exports.lasergameLevels = lasergameLevels;

// This file is for the express purpose of converting the existing mongodb system to postgresql
let pg = require('pg');
let config = require('./secret').pgconfig;
let co = require('co');

let pool = new pg.Pool(config);


process.on('unhandledRejection', function(e) {
    console.log(e.message, e.stack)
});

/**
 * @namespace
 */
let siteUsers = {
    /**
     * Represents a user in the database
     * @typedef {Object} User
     * @property {string} email - varchar(256)
     * @property {string} display_name - varchar(64)
     */

    /**
     * Called when a user is fetched from the database
     * @callback onUserGet
     * @param err - Handle the god damn error
     * @param {User|null} user
     */

    /**
     * Inserts a new user into the database and returns it's data
     * @param {string} email
     * @param {string} displayName
     * @param {string} pass
     * @param {onUserGet} callback
     */
    insert: function (email, displayName, pass, callback) {
        pool.query("INSERT INTO site_users (email, password, display_name) VALUES ($1, $2, $3) RETURNING *", [email, pass, displayName], function onInsertComplete (err, res) {
            if (res) return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     * Called when the user password is fetched from the database
     * @callback onPasswordGet
     * @param err - Handle the god damn error
     * @param {string|null} password - the hashed password
     */

    /**
     * Fetches the hashed password string by user email
     * @param {string} email
     * @param {onPasswordGet} callback
     */
    getPasswordByEmail: function (email, callback) {
        pool.query('SELECT * FROM site_users WHERE email = $1', [email], function onPasswordGet (err, res) {
            if (res) return callback(err, res.rows[0].password);
            return callback(err, null);
        });
    },

    /**
     * Fetch a user by email
     * @param {string} email
     * @param {onUserGet} callback
     */
    getUserByEmail: function (email, callback) {
        pool.query('SELECT * FROM site_users WHERE email = $1', [email], function onUserGet (err, res) {
            if (res) return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     * Fetch a user by display_name
     * @param {string} displayName
     * @param {onUserGet} callback
     */
    getUserByDisplayName: function(displayName, callback) {
        pool.query('SELECT * FROM site_users WHERE display_name = $1', [displayName], function onUserGet (err, res) {
            if (res) return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     * @callback onGetAll
     * @param err
     * @param {User[]} userArray
     */

    /**
     * Fetch all users
     * @param {onGetAll} callback
     */
    getAll: function (callback) {
        pool.query('SELECT * FROM site_users', function onGetAll (err, res) {
            if (res) return callback(err, res.rows);
            return callback(err, null);
        });
    }
};

/**
 * @namespace
 */
let lasergameLevels = {
    /**
     * Represents a LasergameLevel in the database
     * @typedef {Object} LasergameLevel
     * @property id
     * @property name
     * @property level_data
     * @property upload_timestamp
     * @property times_beaten
     * @property user_display_name
     */

    /**
     * @callback onGetAllLevelsOfPlayer
     * @param err
     * @param {LasergameLevel[]|null} lasergameLevels
     */

    /**
     *
     * @param {string} playerName
     * @param {onGetAllLevelsOfPlayer} callback
     */
    getAllLevelsOfPlayer: function (playerName, callback) {
        pool.query('SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC', [playerName], function onLevelGet (err, res) {
            if (res) return callback(err, res.rows);
            return callback(err, null);
        });
    },

    /**
     * @callback onGetLevelByID
     * @param err
     * @param {LasergameLevel|null} lasergameLevel
     */

    /**
     *
     * @param {number} id
     * @param {onGetLevelByID} callback
     */
    getLevelByID: function (id, callback) {
        pool.query('SELECT * FROM lasergame_levels WHERE id = $1', [id], function onLevelGet (err, res) {
            if (res) return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     * @callback onInsert
     * @param err
     * @param {number|null} id - returns the generated id of the level
     */

    /**
     *
     * @param {Object} levelData
     * @param {string} name
     * @param {string} userDisplayName
     * @param {onInsert} callback
     */
    insert: function (levelData, name, userDisplayName, callback) {
        console.log('Attempting to insert lasergame level of: ' + userDisplayName);
        pool.query('INSERT INTO lasergame_levels (level_data, name, user_display_name) VALUES ($1, $2, $3) RETURNING id', [JSON.stringify(levelData), name, userDisplayName], function onLevelInsert (err, res) {
            if (res) return callback(err, res.rows[0].id);
            return callback(err, null);
        });
    }
};







module.exports.siteUsers = siteUsers;
module.exports.lasergameLevels = lasergameLevels;
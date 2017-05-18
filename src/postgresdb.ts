// This file is for the express purpose of converting the existing mongodb system to postgresql
let pg = require('pg');
let config = require('./secret').pgconfig;

let pool = new pg.Pool(config);

import { SiteUser, LasergameLevel } from './dbmodels';


process.on('unhandledRejection', function(e: Error) {
    console.log(e.message, e.stack)
});

pool.query("CREATE TABLE IF NOT EXISTS site_users (email varchar(256) PRIMARY KEY, password varchar(80) NOT NULL, display_name varchar(64) UNIQUE NOT NULL);");
pool.query("CREATE TABLE IF NOT EXISTS lasergame_levels (id serial PRIMARY KEY, name varchar(64) NOT NULL, level_data jsonb NOT NULL, upload_timestamp timestamptz DEFAULT current_timestamp, times_beaten int DEFAULT 0, user_display_name varchar(64) references site_users (display_name));")

let siteUsers = {
    /**
     * Inserts a new user into the database and returns it's data
     * @param {string} email
     * @param {string} displayName
     * @param {string} pass
     * @param {onUserGet} callback
     */
    insert: function (email: string, displayName: string, pass: string, callback: (err: Error, user: SiteUser) => void) {
        pool.query("INSERT INTO site_users (email, password, display_name) VALUES ($1, $2, $3) RETURNING *", [email, pass, displayName], function onInsertComplete (err: Error, res: any) {
            if (res) return callback(err, <SiteUser>res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     * Fetches the hashed password string by user email
     * @param {string} email
     * @param {onPasswordGet} callback
     */
    getPasswordByEmail: function (email: string, callback: (err: Error, password: string) => void) {
        pool.query('SELECT * FROM site_users WHERE email = $1', [email], function onPasswordGet (err: Error, res: any) {
            if (res) return callback(err, res.rows[0].password);
            return callback(err, null);
        });
    },

    /**
     * Fetch a user by email
     * @param {string} email
     * @param {onUserGet} callback
     */
    getUserByEmail: function (email: string, callback: (err: Error, user: SiteUser) => void) {
        pool.query('SELECT * FROM site_users WHERE email = $1', [email], function onUserGet (err: Error, res: any) {
            if (res) return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     * Fetch a user by display_name
     * @param {string} displayName
     * @param {onUserGet} callback
     */
    getUserByDisplayName: function(displayName: string, callback: (err: Error, user: SiteUser) => void) {
        pool.query('SELECT * FROM site_users WHERE display_name = $1', [displayName], function onUserGet (err: Error, res: any) {
            if (res) return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     * Fetch all users
     * @param {onGetAll} callback
     */
    getAll: function (callback: (err: Error, allUsers: SiteUser[]) => void) {
        pool.query('SELECT * FROM site_users', function onGetAll (err: Error, res: any) {
            if (res) return callback(err, res.rows);
            return callback(err, null);
        });
    }
};

let lasergameLevels = {
    /**
     *
     * @param {string} playerName
     * @param {onGetAllLevelsOfPlayer} callback
     */
    getAllLevelsOfPlayer: function (playerName: string, callback: (err: Error, levels: LasergameLevel[]) => void) {
        pool.query('SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC', [playerName], function onLevelGet (err: Error, res: any) {
            if (res) return callback(err, res.rows);
            return callback(err, null);
        });
    },

    /**
     *
     * @param {number} id
     * @param {onGetLevelByID} callback
     */
    getLevelByID: function (id: number, callback: (err: Error, level: LasergameLevel) => void) {
        pool.query('SELECT * FROM lasergame_levels WHERE id = $1', [id], function onLevelGet (err: Error, res: any) {
            if (res) return callback(err, res.rows[0]);
            return callback(err, null);
        });
    },

    /**
     *
     * @param {Object} levelData
     * @param {string} name
     * @param {string} userDisplayName
     * @param {onInsert} callback
     */
    insert: function (levelData: any, name: string, userDisplayName: string, callback: (err: Error, id: number) => void) {
        console.log('Attempting to insert lasergame level of: ' + userDisplayName);
        pool.query('INSERT INTO lasergame_levels (level_data, name, user_display_name) VALUES ($1, $2, $3) RETURNING id', [JSON.stringify(levelData), name, userDisplayName], function onLevelInsert (err: Error, res: any) {
            if (res) return callback(err, res.rows[0].id);
            return callback(err, null);
        });
    }
};

export { siteUsers, lasergameLevels };
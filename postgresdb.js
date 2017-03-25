// This file is for the express purpose of converting the existing mongodb system to postgresql
let pg = require('pg');
let config = require('./secret').pgconfig;
let co = require('co');

let pgPool = new pg.Pool(config);


process.on('unhandledRejection', function(e) {
    console.log(e.message, e.stack)
});

let pgUsers = {};

pgUsers.insert = co.wrap(function* (email, pass, next) {
    try {
        let res = yield pgPool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, pass]);
        console.log(res);
    } catch (err) {
        next(err);
    }
});

module.exports.pgUsers = pgUsers;
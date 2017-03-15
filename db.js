/**
 * Created by kosty on 3/13/2017.
 */
const co = require('co');

const monk = require('monk');
const db = monk("localhost:27017/myproject");

const userCollection = db.get('usercollection');

let users = {};

users.getUserPassword = co.wrap(function* (username) {
    return yield userCollection.findOne({username: username}, 'password');
});

users.findByUsername = co.wrap(function* (username) {
    return yield userCollection.findOne({username: username}, '-password');
});

users.findById = co.wrap(function* (id) {
    return yield userCollection.findOne({_id: id}, '-password');
});

users.findAll = co.wrap(function* () {
    return yield userCollection.find('-password');
});

users.insert = co.wrap(function* (username, password) {
    return yield userCollection.insert({
        "username" : username,
        "password": password
    });
});

module.exports = {users: users};
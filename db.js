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

users.findAllUsernames = co.wrap(function* () {
    try {
        return yield userCollection.find({}, 'username');
    } catch (err) {
        console.log(err);
    }
});

users.insert = co.wrap(function* (username, password) {
    let result = yield userCollection.insert({
        "username" : username,
        "password": password
    });
    return result.insertedId;
});

users.addLasergameLevel = co.wrap(function* (userID, pathsString, name) {
    let currentDate = new Date();
    yield userCollection.update(
        {_id: userID}, {
            $push: {
                lasergameLevels: {
                    level: pathsString,
                    name: name,
                    uploadTime: currentDate.toString(),
                    solutions: 0
                }
            }
        }
    );
});

users.getLasergameLevel = co.wrap(function* (username, index) {
    let user = yield users.findByUsername(username);
    return JSON.stringify(user.lasergameLevels[index]);
});

module.exports = {siteUsers: users};
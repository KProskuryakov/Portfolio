/**
 * Created by kosty on 3/13/2017.
 */
const monk = require('monk');
const db = monk("localhost:27017/myproject");

module.exports = {userCollection: db.get('usercollection')};

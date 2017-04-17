/**
 * Created by kosty on 4/3/2017.
 */
let pass = require('./secret').password;

let Sequelize = require('sequelize');
let sequelize = new Sequelize('portfolio', 'kosty', pass);

let User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'display_name',
        primaryKey: true
    }
});

User.sync().then(
    function() {
        console.log('Users synced');
    }
);
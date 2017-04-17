# Sequelize
I just found this crazy thing. Strange how I didn't think of using an ORM for this nonsense.
I tried learning sql but nope, not doing that right now. Too much.

## Installation

```
npm install --save sequelize
npm install --save pg pg-hstore
```

## Basic usage

```
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');
```
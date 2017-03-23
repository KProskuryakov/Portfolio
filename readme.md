# Readme
### Routing
To add a route, real quick-like:

```js
// in app.js
let route = require("./routes/route");
app.use('route', route)
```

Create new route.js file in routes/ folder

```js
// just a sample
var express = require('express');
var router = express.Router();

/* GET this page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
```

And all should be good.

### DB

```console
npm install mongodb --save
```

Have mongodb installed. Now we're gonna make a mongod instance.

```console
mongod --dbpath=./data
```

### nodemon

This is a useful little module thing that restarts the server when any js files are changed in the fs. I have it installed globally.


### body-parser

Apparently this parses req.body as json for me if I send a json stringified string object thing. That's cool to know.

let pg = require('pg');
let config = require('../secret').pgconfig;

let pool = new pg.Pool(config);

process.on('unhandledRejection', function (e: Error) {
  console.log(e.message, e.stack)
});

export default pool;
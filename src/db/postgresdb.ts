let pg = require('pg')
const url = require('url')
import { Pool } from '@types/pg'

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

let pool: Pool = new pg.Pool(config)

process.on('unhandledRejection', function (e: Error) {
  console.log(e.message, e.stack)
})

export default pool
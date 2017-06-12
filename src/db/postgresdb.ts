let pg = require('pg')
let config = require('../secret').pgconfig
import { Pool } from '@types/pg'

let pool: Pool = new pg.Pool(config)

process.on('unhandledRejection', function (e: Error) {
  console.log(e.message, e.stack)
})

export default pool
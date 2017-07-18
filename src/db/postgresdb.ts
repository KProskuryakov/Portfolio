import pg = require("pg");
import url = require("url");
import { Pool } from "pg";

import winston from "winston";

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(":");

const config = {
  database: params.pathname.split("/")[1],
  host: params.hostname,
  idleTimeoutMillis: 30000,
  max: 10,
  password: auth[1],
  port: parseInt(params.port, 10),
  ssl: process.env.IS_DATABASE_SSL === "true",
  user: auth[0],
};

const pool: Pool = new pg.Pool(config);

process.on("unhandledRejection", (e: Error) => {
  winston.error(e.message, e.stack);
});

export default pool;

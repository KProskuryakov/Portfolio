import pool from './postgresdb'
import WebData from './models/web-data'

pool.query(`CREATE TABLE IF NOT EXISTS web_data
  (
    url text PRIMARY KEY,
    title text,
    keywords text,
    description text,
    upload timestamptz DEFAULT current_timestamp
  );`
)

export async function insertWebData(obj: WebData): Promise<WebData> {
  let res = await pool.query("INSERT INTO web_data (url, title, keywords, description) VALUES ($1, $2, $3, $4) RETURNING *;", [obj.url, obj.title, obj.keywords, obj.description])
  return res.rows[0]
}

export async function getAllWebDatas(): Promise<WebData[]> {
  let res = await pool.query("SELECT * FROM web_data;")
  return res.rows
}
import WebData from "./models/WebData";
import pool from "./Postgres";

export async function insertWebData(obj: WebData): Promise<WebData> {
  const res = await pool.query(
    `INSERT INTO web_data (url, title, keywords, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`,
    [obj.url, obj.title, obj.keywords, obj.description]);
  return res.rows[0];
}

export async function getAllWebDatas(): Promise<WebData[]> {
  const res = await pool.query("SELECT * FROM web_data;");
  return res.rows;
}

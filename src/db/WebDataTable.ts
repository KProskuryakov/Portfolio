import IWebData from "./models/WebData";
import pool from "./Postgres";

pool.query(`
CREATE TABLE IF NOT EXISTS web_data
(
  url text PRIMARY KEY,
  title text,
  keywords text,
  description text,
  upload timestamptz DEFAULT current_timestamp
);`);

export async function insertWebData(obj: IWebData): Promise<IWebData> {
  const res = await pool.query(`INSERT INTO web_data (url, title, keywords, description)
                                VALUES ($1, $2, $3, $4)
                                RETURNING *;`,
                                [obj.url, obj.title, obj.keywords, obj.description]);
  return res.rows[0];
}

export async function getAllWebDatas(): Promise<IWebData[]> {
  const res = await pool.query("SELECT * FROM web_data;");
  return res.rows;
}

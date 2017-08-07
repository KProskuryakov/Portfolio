import LasergameDailyLevel from "./models/LasergameDailyLevel";
import pool from "./Postgres";

import Path from "../lasergame/Path";

export async function getDailyLevel(date: string): Promise<LasergameDailyLevel> {
  const res = await pool.query("SELECT * FROM lasergame_daily_levels WHERE daily_date = $1", [date]);
  return res.rows[0];
}

export async function getAllDailyLevels(): Promise<LasergameDailyLevel[]> {
  const res = await pool.query("SELECT * FROM lasergame_daily_levels");
  return res.rows;
}

export async function insertDailyLevel(levelData: Path[], seed: number): Promise<LasergameDailyLevel> {
  const res = await pool.query("INSERT INTO lasergame_daily_levels (level_data, seed) VALUES ($1, $2) RETURNING *",
    [JSON.stringify(levelData), seed]);
  return res.rows[0];
}

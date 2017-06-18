import pool from './postgresdb'
import LasergameDailyLevel from './models/lasergame-daily-level'

import Path from '../lasergame-frontend/classes/path'

pool.query(`CREATE TABLE IF NOT EXISTS lasergame_daily_levels 
  (
    daily_date date PRIMARY KEY DEFAULT CURRENT_DATE, 
    level_data jsonb NOT NULL, 
    seed bigint NOT NULL, 
    times_beaten int DEFAULT 0
  );`
)

export async function getDailyLevel(date: string): Promise<LasergameDailyLevel> {
  let res = await pool.query('SELECT * FROM lasergame_daily_levels WHERE daily_date = $1', [date])
  return res.rows[0]
}

export async function getAllDailyLevels(): Promise<LasergameDailyLevel[]> {
  let res = await pool.query('SELECT * FROM lasergame_daily_levels')
  return res.rows
}

export async function insertDailyLevel(levelData: Path[], seed: number): Promise<LasergameDailyLevel> {
  let res = await pool.query('INSERT INTO lasergame_daily_levels (level_data, seed) VALUES ($1, $2) RETURNING *', [JSON.stringify(levelData), seed])
  return res.rows[0]
}
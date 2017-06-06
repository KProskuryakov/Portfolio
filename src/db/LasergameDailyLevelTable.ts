import pool from './postgresdb';
import LasergameDailyLevel from './models/LasergameDailyLevel';

import Path from '../lasergame-frontend/classes/path';

pool.query("CREATE TABLE IF NOT EXISTS lasergame_daily_levels (daily_date date PRIMARY KEY DEFAULT CURRENT_DATE, level_data jsonb NOT NULL, seed bigint NOT NULL);");

export function getTodaysDailyLevel(callback: (err: Error, level: LasergameDailyLevel) => void) {
  pool.query('SELECT * FROM lasergame_daily_levels WHERE daily_date = CURRENT_DATE', (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}

export function getDailyLevel(date: string, callback: (err: Error, level: LasergameDailyLevel) => void) {
  pool.query('SELECT * FROM lasergame_daily_levels WHERE daily_date = $1', [date], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}

export function getAllDailyLevels(callback: (err: Error, levels: LasergameDailyLevel[]) => void) {
  pool.query('SELECT * FROM lasergame_daily_levels', (err: Error, res: any) => {
    if (res) return callback(err, res.rows);
    return callback(err, null);
  });
}

export function insertDailyLevel(levelData: Path[], seed: number, callback: (err: Error, date: LasergameDailyLevel) => void) {
  pool.query('INSERT INTO lasergame_daily_levels (level_data, seed) VALUES ($1, $2) RETURNING *', [JSON.stringify(levelData), seed], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}
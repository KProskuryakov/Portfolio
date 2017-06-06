import pool from './postgresdb';

pool.query("CREATE TABLE IF NOT EXISTS lasergame_daily_levels (daily_date date PRIMARY KEY DEFAULT CURRENT_DATE, level jsonb NOT NULL);");

/**
 * Represents a daily lasergame level in the database
 * 
 * @export
 * @interface LasergameDailyLevel
 * daily_date: Date PRIMARY KEY
 * level_data: jsonb
 */
export interface LasergameDailyLevel {
  daily_date: string,
  level_data: any
}

export default LasergameDailyLevel;

export function getTodaysDailyLevel(callback: (err: Error, level: LasergameDailyLevel) => void) {
  pool.query('SELECT * FROM lasergame_daily_levels WHERE date = CURRENT_DATE', (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}

export function getDailyLevel(date: string, callback: (err: Error, level: LasergameDailyLevel) => void) {
  pool.query('SELECT * FROM lasergame_daily_levels WHERE date = $1', [date], (err: Error, res: any) => {
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

export function insertDailyLevel(levelData: object, callback: (err: Error, date: LasergameDailyLevel) => void) {
  pool.query('INSERT INTO lasergame_daily_levels (level_data) VALUES ($1) RETURNING *', [JSON.stringify(levelData)], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}
import pool from './postgresdb';
import LasergameLevel from './models/LasergameLevel';

pool.query("CREATE TABLE IF NOT EXISTS lasergame_levels (id serial PRIMARY KEY, name varchar(64) NOT NULL, level_data jsonb NOT NULL, upload_timestamp timestamptz DEFAULT current_timestamp, times_beaten int DEFAULT 0, user_display_name varchar(64) references site_users (display_name));")

export function getAllLasergameLevelsOfSiteUser(playerName: string, callback: (err: Error, levels: LasergameLevel[]) => void) {
  pool.query('SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC', [playerName], (err: Error, res: any) => {
    if (res) return callback(err, res.rows);
    return callback(err, null);
  });
}

export function getLasergameLevelByID(id: number, callback: (err: Error, level: LasergameLevel) => void) {
  pool.query('SELECT * FROM lasergame_levels WHERE id = $1', [id], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}

export function insertLasergameLevel(levelData: any, name: string, userDisplayName: string, callback: (err: Error, id: number) => void) {
  console.log('Attempting to insert lasergame level of: ' + userDisplayName);
  pool.query('INSERT INTO lasergame_levels (level_data, name, user_display_name) VALUES ($1, $2, $3) RETURNING id', [JSON.stringify(levelData), name, userDisplayName], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0].id);
    return callback(err, null);
  });
}
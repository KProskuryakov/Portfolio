import pool from "../../db/Postgres";

/**
 * id: SERIAL PRIMARY KEY
 * name: varchar(64)
 * level_data: jsonb
 * upload_timestamp: timestamp with timezone?
 * times_beaten: integer?
 * user_display_name: varchar(64) fkey to site_users.display_name
 */
export default interface LasergameLevel {
  id: number;
  name: string;
  level_data: any;
  upload_timestamp: string;
  times_beaten: number;
  user_display_name: string;
}

export async function getAllLasergameLevelsOfSiteUser(playerName: string): Promise<LasergameLevel[]> {
  const res = await pool.query("SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC;",
    [playerName]);
  return res.rows;
}

export async function getLasergameLevelByID(
  id: number,
): Promise<LasergameLevel> {
  const res = await pool.query("SELECT * FROM lasergame_levels WHERE id = $1;", [id]);
  return res.rows[0];
}

export async function insertLasergameLevel(
  levelData: any,
  name: string,
  userDisplayName: string,
): Promise<LasergameLevel> {
  const res = await pool.query(
    `INSERT INTO lasergame_levels (level_data, name, user_display_name)
      VALUES ($1, $2, $3)
      RETURNING *;`,
    [JSON.stringify(levelData), name, userDisplayName]);
  return res.rows[0];
}

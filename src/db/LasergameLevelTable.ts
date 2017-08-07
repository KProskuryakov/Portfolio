import LasergameLevel from "./models/LasergameLevel";
import pool from "./Postgres";

export async function getAllLasergameLevelsOfSiteUser(playerName: string): Promise<LasergameLevel[]> {
  const res = await pool.query("SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC;",
    [playerName]);
  return res.rows;
}

export async function getLasergameLevelByID(
  id: number): Promise<LasergameLevel> {
  const res = await pool.query("SELECT * FROM lasergame_levels WHERE id = $1;", [id]);
  return res.rows[0];
}

export async function insertLasergameLevel(
  levelData: any, name: string, userDisplayName: string): Promise<LasergameLevel> {
  const res = await pool.query(
    `INSERT INTO lasergame_levels (level_data, name, user_display_name)
      VALUES ($1, $2, $3)
      RETURNING *;`,
    [JSON.stringify(levelData), name, userDisplayName]);
  return res.rows[0];
}
